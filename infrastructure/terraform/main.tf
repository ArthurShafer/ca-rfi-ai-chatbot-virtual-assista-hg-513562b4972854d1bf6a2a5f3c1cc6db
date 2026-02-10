# DigitalOcean Droplet for Demo Hosting
# Hosts multiple campaign demos via Docker + Caddy reverse proxy

terraform {
  required_version = ">= 1.5"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.36"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

# SSH key for access
resource "digitalocean_ssh_key" "demo_server" {
  name       = "demo-server-key"
  public_key = file(var.ssh_public_key_path)
}

# Firewall
resource "digitalocean_firewall" "demo_server" {
  name        = "demo-server-fw"
  droplet_ids = [digitalocean_droplet.demo_server.id]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}

# Droplet
resource "digitalocean_droplet" "demo_server" {
  name     = "demo-server"
  image    = "ubuntu-24-04-x64"
  size     = "s-2vcpu-2gb" # $18/mo — 2 vCPU, 2GB RAM, 50GB SSD
  region   = var.region
  ssh_keys = [digitalocean_ssh_key.demo_server.fingerprint]

  user_data = file("${path.module}/cloud-init.yml")

  tags = ["demo-server", "campaigns"]
}

# Outputs
output "server_ip" {
  value       = digitalocean_droplet.demo_server.ipv4_address
  description = "Public IP — point arthurshafer.com A record here"
}

output "ssh_command" {
  value       = "ssh root@${digitalocean_droplet.demo_server.ipv4_address}"
  description = "SSH into the server"
}
