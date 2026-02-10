# Terraform Generation Guide

## Module Library

Available reusable modules in `terraform/modules/`:

| Module | Purpose | When to Include |
|--------|---------|-----------------|
| `networking` | VPC, subnets, gateways | Always (production deployment needs a VPC) |
| `iam-base` | App execution role, policies | Always (every AWS app needs IAM) |
| `monitoring` | CloudWatch logs, dashboards, alarms | Always (operational requirement) |
| `s3-backend` | Terraform state storage | Always (best practice for IaC) |
| `dns-ssl` | Route 53, ACM certificate | If project uses a custom domain |
| `ecr` | Container registry | If project uses Docker containers |

## Application-Specific Resources

The modules cover common infrastructure. Each project also needs app-specific resources. Generate these based on the project profile:

### App Runner Project
```hcl
resource "aws_apprunner_service" "app" {
  service_name = "${var.project_name}-${var.environment}"

  source_configuration {
    image_repository {
      image_identifier      = "${module.ecr.repository_url}:latest"
      image_repository_type = "ECR"
      image_configuration {
        port = var.app_port
        runtime_environment_variables = {
          ENVIRONMENT = var.environment
        }
      }
    }
    authentication_configuration {
      access_role_arn = module.iam_base.role_arn
    }
    auto_deployments_enabled = false
  }

  instance_configuration {
    cpu    = var.app_cpu
    memory = var.app_memory
  }

  tags = local.common_tags
}
```

### Lambda Project
```hcl
resource "aws_lambda_function" "app" {
  function_name = "${var.project_name}-${var.environment}"
  role          = module.iam_base.role_arn
  handler       = "handler.lambda_handler"
  runtime       = "python3.11"
  timeout       = 30
  memory_size   = 256

  filename         = "lambda.zip"
  source_code_hash = filebase64sha256("lambda.zip")

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  tags = local.common_tags
}

resource "aws_apigatewayv2_api" "http" {
  name          = "${var.project_name}-${var.environment}"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.app.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.app.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}
```

### ECS Fargate Project
```hcl
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-${var.environment}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.app_cpu
  memory                   = var.app_memory
  execution_role_arn       = module.iam_base.role_arn

  container_definitions = jsonencode([{
    name  = "app"
    image = "${module.ecr.repository_url}:latest"
    portMappings = [{
      containerPort = var.app_port
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = module.monitoring.log_group_name
        "awslogs-region"        = data.aws_region.current.name
        "awslogs-stream-prefix" = "app"
      }
    }
  }])
}

resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-${var.environment}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.networking.private_subnet_ids
    security_groups  = [module.networking.app_security_group_id]
    assign_public_ip = false
  }
}
```

## Composition Pattern

The root `main.tf` composes modules and app resources.

**REQUIRED**: The `default_tags` block is mandatory on every project (see CLAUDE.md "Demo Build Standards #6"). This tags every resource automatically so you can track costs per demo.

```hcl
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

module "networking" {
  source             = "./modules/networking"
  project_name       = var.project_name
  environment        = var.environment
  enable_nat_gateway = false  # $32/month -- enable for production
}

module "iam_base" {
  source         = "./modules/iam-base"
  project_name   = var.project_name
  s3_bucket_arns = []  # Add if S3 is used
}

module "monitoring" {
  source       = "./modules/monitoring"
  project_name = var.project_name
  environment  = var.environment
  alarm_email  = var.alarm_email
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}

# App-specific resources below...
```

## Variables Pattern

```hcl
variable "project_name" {
  description = "Project identifier used in resource naming"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "app_port" {
  description = "Application listening port"
  type        = number
  default     = 80
}

variable "app_cpu" {
  description = "CPU units for the application (256, 512, 1024, 2048, 4096)"
  type        = string
  default     = "256"
}

variable "app_memory" {
  description = "Memory in MB for the application"
  type        = string
  default     = "512"
}

variable "alarm_email" {
  description = "Email for CloudWatch alarm notifications"
  type        = string
  default     = ""
}
```

## Outputs Pattern

```hcl
output "app_url" {
  description = "Application URL"
  value       = aws_apprunner_service.app.service_url  # Adjust for Lambda/ECS
}

output "ecr_repository_url" {
  description = "ECR repository URL for pushing images"
  value       = module.ecr.repository_url
}

output "log_group_name" {
  description = "CloudWatch log group for application logs"
  value       = module.monitoring.log_group_name
}
```

## Backend Configuration

```hcl
terraform {
  backend "s3" {
    bucket         = "terraform-state-ACCOUNT_ID"
    key            = "PROJECT_NAME/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

## Example tfvars

```hcl
# terraform.tfvars.example
project_name = "contract-dashboard"
environment  = "production"
aws_region   = "us-east-1"
app_port     = 80
app_cpu      = "256"
app_memory   = "512"
alarm_email  = "ops@easycompanycloudworks.com"
```

## Cloud Mapping

After generating Terraform, create `terraform/CLOUD-MAPPING.md` listing only the AWS services THIS project uses, with Azure and GCP equivalents.

Format:

```markdown
# Cloud Service Mapping

| Capability | AWS (Current) | Azure Equivalent | GCP Equivalent |
|-----------|---------------|------------------|----------------|
| Container Registry | ECR | Azure Container Registry | Artifact Registry |
| App Hosting | App Runner | Azure Container Apps | Cloud Run |
| ...  | ... | ... | ... |
```

Include only services the project actually uses. Do not list services that are not in the Terraform configuration.
