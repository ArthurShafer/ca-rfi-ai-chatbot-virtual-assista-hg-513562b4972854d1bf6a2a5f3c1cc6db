-- Tulare County AI Chatbot — Database Schema
-- Compatible with PostgreSQL 16 + pgvector
-- Run against fresh database or Supabase project

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DEPARTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_es TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    description_es TEXT,
    phone TEXT,
    email TEXT,
    url TEXT,
    keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CONTENT CHUNKS (with vector embeddings)
-- ============================================================
CREATE TABLE IF NOT EXISTS content_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    source_url TEXT NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    content_es TEXT,
    embedding vector(384),
    chunk_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- HNSW index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_content_chunks_embedding
    ON content_chunks USING hnsw (embedding vector_cosine_ops)
    WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_content_chunks_department
    ON content_chunks (department_id);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language TEXT DEFAULT 'en',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    message_count INTEGER DEFAULT 0,
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_conversations_started_at
    ON conversations (started_at);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    tokens_used INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
    ON messages (conversation_id);

-- ============================================================
-- ANALYTICS DAILY (pre-aggregated, future use)
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_daily (
    date DATE PRIMARY KEY,
    total_conversations INTEGER DEFAULT 0,
    total_messages INTEGER DEFAULT 0,
    avg_messages_per_conversation FLOAT,
    avg_response_time_ms FLOAT,
    conversations_by_department JSONB DEFAULT '{}',
    conversations_by_language JSONB DEFAULT '{}',
    top_questions JSONB DEFAULT '[]',
    satisfaction_avg FLOAT
);

-- ============================================================
-- SEED DATA: Departments
-- ============================================================
INSERT INTO departments (name, name_es, slug, description, description_es, phone, email, url, keywords) VALUES
(
    'Health & Human Services Agency',
    'Agencia de Salud y Servicios Humanos',
    'hhsa',
    'Provides health care, social services, and public assistance programs including CalFresh, Medi-Cal, and WIC.',
    'Proporciona atención médica, servicios sociales y programas de asistencia pública incluyendo CalFresh, Medi-Cal y WIC.',
    '(559) 624-8000',
    NULL,
    'https://tchhsa.org',
    ARRAY['calfresh', 'medi-cal', 'wic', 'benefits', 'health', 'mental health', 'behavioral', 'food stamps', 'medical', 'insurance', 'snap', 'beneficios', 'salud', 'seguro medico', 'asistencia', 'public health', 'crisis']
),
(
    'Resource Management Agency',
    'Agencia de Gestión de Recursos',
    'rma',
    'Handles building permits, planning, zoning, code enforcement, and inspections.',
    'Maneja permisos de construcción, planificación, zonificación, cumplimiento de códigos e inspecciones.',
    '(559) 624-7000',
    NULL,
    'https://tularecounty.ca.gov/rma',
    ARRAY['permit', 'building', 'zoning', 'planning', 'inspection', 'code', 'construction', 'land use', 'permiso', 'construccion', 'zonificacion', 'inspeccion']
),
(
    'Assessor / Clerk-Recorder',
    'Asesor / Secretario-Registrador',
    'clerk',
    'Manages property assessments, vital records (birth, marriage, death certificates), and official document recording.',
    'Administra evaluaciones de propiedad, registros vitales (certificados de nacimiento, matrimonio, defunción) y registro de documentos oficiales.',
    '(559) 636-5000',
    NULL,
    'https://tularecounty.ca.gov/assessor',
    ARRAY['birth certificate', 'marriage', 'death certificate', 'property', 'assessment', 'tax', 'deed', 'recording', 'vital records', 'certificado', 'nacimiento', 'matrimonio', 'defuncion', 'propiedad', 'impuesto']
),
(
    'Sheriff''s Office',
    'Oficina del Sheriff',
    'sheriff',
    'Law enforcement services including patrol, investigations, jail operations, and community programs.',
    'Servicios de aplicación de la ley incluyendo patrullaje, investigaciones, operaciones de cárcel y programas comunitarios.',
    '(559) 733-6218',
    NULL,
    'https://tularecounty.ca.gov/sheriff',
    ARRAY['report', 'crime', 'inmate', 'jail', 'warrant', 'police', 'emergency', 'safety', 'crimen', 'preso', 'carcel', 'policia', 'seguridad', 'denuncia']
),
(
    'Animal Services',
    'Servicios de Animales',
    'animal',
    'Pet adoption, stray animal pickup, licensing, and animal welfare services.',
    'Adopción de mascotas, recogida de animales callejeros, licencias y servicios de bienestar animal.',
    '(559) 636-4050',
    NULL,
    'https://tularecounty.ca.gov/animal-services',
    ARRAY['dog', 'cat', 'pet', 'stray', 'adopt', 'animal', 'shelter', 'license', 'perro', 'gato', 'mascota', 'adoptar', 'refugio', 'licencia']
),
(
    'Fire Department',
    'Departamento de Bomberos',
    'fire',
    'Fire prevention, suppression, rescue services, burn permits, and safety inspections.',
    'Prevención de incendios, supresión, servicios de rescate, permisos de quema e inspecciones de seguridad.',
    '(559) 733-6200',
    NULL,
    'https://tularecounty.ca.gov/fire',
    ARRAY['fire', 'burn', 'safety', 'inspection', 'rescue', 'emergency', 'incendio', 'quema', 'seguridad', 'rescate', 'emergencia']
),
(
    'General / County Services',
    'Servicios Generales del Condado',
    'general',
    'General county information, office hours, board of supervisors, and miscellaneous services.',
    'Información general del condado, horarios de oficina, junta de supervisores y servicios varios.',
    '(559) 636-5000',
    NULL,
    'https://tularecounty.ca.gov',
    ARRAY['hours', 'office', 'board', 'supervisor', 'county', 'general', 'information', 'horario', 'oficina', 'junta', 'condado', 'informacion']
)
ON CONFLICT (slug) DO NOTHING;
