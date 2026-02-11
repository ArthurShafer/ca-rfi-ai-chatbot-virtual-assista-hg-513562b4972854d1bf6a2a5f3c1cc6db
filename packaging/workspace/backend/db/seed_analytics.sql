-- Mock analytics data for demo dashboard
-- Target: ~180 conversations over 30 days, 61% Spanish / 39% English
-- Distribution weighted toward HHSA and General (highest traffic depts)

-- Helper: generate conversations spread over last 30 days
-- 110 Spanish conversations (~61%), 70 English conversations (~39%)

-- HHSA - Spanish (35 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'es', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 6) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 35)
WHERE d.slug = 'hhsa';

-- HHSA - English (18 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'en', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 6) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 18)
WHERE d.slug = 'hhsa';

-- RMA - Spanish (18 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'es', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 5) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 18)
WHERE d.slug = 'rma';

-- RMA - English (12 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'en', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 5) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 12)
WHERE d.slug = 'rma';

-- Clerk - Spanish (16 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'es', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 4) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 16)
WHERE d.slug = 'clerk';

-- Clerk - English (10 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'en', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 4) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 10)
WHERE d.slug = 'clerk';

-- Sheriff - Spanish (12 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'es', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 4) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 12)
WHERE d.slug = 'sheriff';

-- Sheriff - English (8 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'en', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 4) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 8)
WHERE d.slug = 'sheriff';

-- Animal Services - Spanish (10 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'es', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 4) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 10)
WHERE d.slug = 'animal';

-- Animal Services - English (7 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'en', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 4) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 7)
WHERE d.slug = 'animal';

-- Fire - Spanish (8 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'es', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 3) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 8)
WHERE d.slug = 'fire';

-- Fire - English (5 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'en', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 3) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 5)
WHERE d.slug = 'fire';

-- General - Spanish (11 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'es', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 5) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 11)
WHERE d.slug = 'general';

-- General - English (10 conversations)
INSERT INTO conversations (language, department_id, started_at, message_count, satisfaction_rating)
SELECT 'en', d.id,
       now() - (random() * interval '30 days'),
       (floor(random() * 5) + 2)::int,
       CASE WHEN random() > 0.3 THEN (floor(random() * 2) + 4)::int ELSE NULL END
FROM departments d, generate_series(1, 10)
WHERE d.slug = 'general';

-- Now insert user messages for each conversation
-- Spanish questions
WITH es_questions AS (
    SELECT unnest(ARRAY[
        'Como solicitar CalFresh?',
        'Donde puedo obtener un certificado de nacimiento?',
        'Necesito un permiso de construccion',
        'Cual es el horario de la oficina del condado?',
        'Como puedo adoptar una mascota?',
        'Necesito informacion sobre Medi-Cal',
        'Como reportar un incendio?',
        'Donde pago mis impuestos de propiedad?',
        'Necesito un permiso de quema',
        'Como obtengo una licencia para mi perro?',
        'Que requisitos necesito para CalFresh?',
        'Como solicitar asistencia de vivienda?',
        'Donde esta la oficina del sheriff?',
        'Como verificar el estado de mi solicitud?',
        'Necesito ayuda con beneficios de alimentos',
        'Como obtener un acta de matrimonio?',
        'Que servicios de salud mental hay disponibles?',
        'Como puedo obtener WIC?',
        'Donde reporto un animal perdido?',
        'Como solicito una inspeccion?',
        'Necesito informacion sobre permisos ADU',
        'Cual es el numero de telefono de servicios sociales?',
        'Como puedo pagar una multa?',
        'Donde puedo encontrar refugio de emergencia?',
        'Como registro mi propiedad?'
    ]) AS question
),
es_convos AS (
    SELECT c.id, c.started_at, c.department_id,
           ROW_NUMBER() OVER (ORDER BY random()) AS rn
    FROM conversations c WHERE c.language = 'es'
)
INSERT INTO messages (conversation_id, role, content, department_id, created_at)
SELECT ec.id, 'user',
       eq.question,
       ec.department_id,
       ec.started_at + interval '5 seconds'
FROM es_convos ec
CROSS JOIN LATERAL (
    SELECT question FROM es_questions ORDER BY random() LIMIT 1
) eq;

-- English questions
WITH en_questions AS (
    SELECT unnest(ARRAY[
        'How do I apply for CalFresh?',
        'Where can I get a birth certificate?',
        'I need a building permit',
        'What are the county office hours?',
        'How can I adopt a pet?',
        'I need information about Medi-Cal',
        'How do I report a fire?',
        'Where do I pay my property taxes?',
        'I need a burn permit',
        'How do I get a dog license?',
        'What documents do I need for CalFresh?',
        'How do I apply for housing assistance?',
        'Where is the sheriff office?',
        'How do I check my application status?',
        'I need help with food benefits',
        'How do I get a marriage certificate?',
        'What mental health services are available?',
        'How can I get WIC benefits?',
        'Where do I report a lost animal?',
        'How do I request an inspection?'
    ]) AS question
),
en_convos AS (
    SELECT c.id, c.started_at, c.department_id,
           ROW_NUMBER() OVER (ORDER BY random()) AS rn
    FROM conversations c WHERE c.language = 'en'
)
INSERT INTO messages (conversation_id, role, content, department_id, created_at)
SELECT ec.id, 'user',
       eq.question,
       ec.department_id,
       ec.started_at + interval '5 seconds'
FROM en_convos ec
CROSS JOIN LATERAL (
    SELECT question FROM en_questions ORDER BY random() LIMIT 1
) eq;

-- Insert assistant responses for every user message
INSERT INTO messages (conversation_id, role, content, department_id, response_time_ms, created_at)
SELECT m.conversation_id, 'assistant',
       CASE
           WHEN c.language = 'es' THEN
               CASE (floor(random() * 5))::int
                   WHEN 0 THEN 'Puede encontrar esa informacion en la oficina del condado de Tulare. El horario es de lunes a viernes, 8:00 AM a 5:00 PM. Visite tularecounty.ca.gov para mas detalles.'
                   WHEN 1 THEN 'Para solicitar este servicio, puede visitar la oficina en 2900 W Burrel Ave, Visalia, CA 93291 o llamar al telefono que aparece en nuestra pagina. Tambien puede aplicar en linea a traves de BenefitsCal.com.'
                   WHEN 2 THEN 'Los documentos necesarios incluyen identificacion con foto, comprobante de ingresos, numeros de seguro social de los miembros del hogar, y comprobante de residencia. Puede traer estos documentos a nuestra oficina.'
                   WHEN 3 THEN 'Entiendo su consulta. Le recomiendo visitar nuestra pagina web para obtener formularios y requisitos actualizados. Si necesita asistencia adicional, puede llamar durante horas de oficina.'
                   ELSE 'Gracias por su pregunta. La informacion que busca esta disponible en nuestro sitio web tularecounty.ca.gov. Si necesita hablar con alguien directamente, puedo conectarlo con el departamento correspondiente.'
               END
           ELSE
               CASE (floor(random() * 5))::int
                   WHEN 0 THEN 'You can find that information at the Tulare County office. Hours are Monday through Friday, 8:00 AM to 5:00 PM. Visit tularecounty.ca.gov for more details.'
                   WHEN 1 THEN 'To apply for this service, visit the office at 2900 W Burrel Ave, Visalia, CA 93291 or call the number listed on our page. You can also apply online through BenefitsCal.com.'
                   WHEN 2 THEN 'Required documents include photo ID, proof of income, Social Security numbers for household members, and proof of residence. You can bring these documents to our office.'
                   WHEN 3 THEN 'I understand your question. I recommend visiting our website for updated forms and requirements. If you need additional help, you can call during office hours.'
                   ELSE 'Thank you for your question. The information you need is available on our website at tularecounty.ca.gov. If you need to speak with someone directly, I can connect you with the right department.'
               END
       END,
       m.department_id,
       (floor(random() * 2000) + 800)::int,
       m.created_at + interval '3 seconds'
FROM messages m
JOIN conversations c ON c.id = m.conversation_id
WHERE m.role = 'user';

-- Add a few follow-up messages to some conversations (makes message counts more realistic)
WITH multi_turn AS (
    SELECT c.id, c.language, c.department_id, c.started_at
    FROM conversations c
    WHERE c.message_count >= 4
    ORDER BY random()
    LIMIT 60
)
INSERT INTO messages (conversation_id, role, content, department_id, created_at)
SELECT mt.id,
       CASE WHEN gs % 2 = 1 THEN 'user' ELSE 'assistant' END,
       CASE
           WHEN gs % 2 = 1 AND mt.language = 'es' THEN
               (ARRAY['Gracias, y donde queda la oficina?', 'Cuanto tiempo tarda el proceso?', 'Hay servicio en espanol?', 'Puedo hacer esto en linea?'])[floor(random() * 4 + 1)]
           WHEN gs % 2 = 1 THEN
               (ARRAY['Thanks, where is the office located?', 'How long does the process take?', 'Can I do this online?', 'What are the fees?'])[floor(random() * 4 + 1)]
           WHEN mt.language = 'es' THEN
               (ARRAY['La oficina se encuentra en Visalia. El horario es de 8 AM a 5 PM de lunes a viernes.', 'El proceso generalmente tarda entre 5 y 10 dias habiles.', 'Si, puede completar este proceso en linea a traves de nuestro portal.', 'Las tarifas varian segun el tipo de servicio. Visite nuestro sitio web para los precios actuales.'])[floor(random() * 4 + 1)]
           ELSE
               (ARRAY['The office is located in Visalia. Hours are 8 AM to 5 PM, Monday through Friday.', 'The process typically takes 5 to 10 business days.', 'Yes, you can complete this process online through our portal.', 'Fees vary by service type. Visit our website for current pricing.'])[floor(random() * 4 + 1)]
       END,
       mt.department_id,
       mt.started_at + (gs * interval '30 seconds')
FROM multi_turn mt
CROSS JOIN generate_series(1, 4) AS gs;
