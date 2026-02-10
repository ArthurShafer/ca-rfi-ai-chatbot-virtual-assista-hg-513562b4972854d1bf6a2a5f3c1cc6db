-- Seed content chunks for Tulare County AI Chatbot demo
-- These provide real county information so the chatbot can answer questions
-- without needing to run the web scraper first.

-- Note: embeddings are left NULL here. The scraper will populate them,
-- or we can run a lightweight embed-only script. For demo purposes,
-- the LLM will still get this content via keyword fallback.

-- CalFresh / Food Benefits
INSERT INTO content_chunks (department_id, source_url, title, content, chunk_index)
SELECT d.id,
       'https://tchhsa.org/eng/index.cfm/hhsa-services/food-benefits/',
       'CalFresh Benefits - How to Apply',
       'CalFresh (formerly known as Food Stamps) helps low-income individuals and families buy nutritious food. To apply for CalFresh benefits in Tulare County, you can:

1. Apply online at BenefitsCal.com
2. Visit the HHSA office at 5957 S Mooney Blvd, Visalia, CA 93277
3. Call (559) 624-8000 for assistance

Eligibility is based on household size and income. A household of 1 can earn up to $2,510/month gross income. A household of 4 can earn up to $5,178/month.

Required documents: Photo ID, proof of income (pay stubs), Social Security numbers for household members, proof of residence, and bank statements.

Processing time is typically 30 days from application. Expedited service (within 3 days) is available for households with very low income or resources.

CalFresh benefits are loaded onto an EBT card that works like a debit card at grocery stores, farmers markets, and some restaurants for elderly/disabled recipients.

Para solicitar en español, visite BenefitsCal.com o llame al (559) 624-8000.',
       0
FROM departments d WHERE d.slug = 'hhsa'
ON CONFLICT DO NOTHING;

-- Building Permits
INSERT INTO content_chunks (department_id, source_url, title, content, chunk_index)
SELECT d.id,
       'https://tularecounty.ca.gov/rma/building-permits/',
       'Building Permits - Resource Management Agency',
       'The Tulare County Resource Management Agency (RMA) issues building permits for construction, remodeling, and other development projects in unincorporated Tulare County.

How to apply for a building permit:
1. Submit an application online through the EnerGov portal or in person
2. Visit the RMA office at 5961 S Mooney Blvd, Visalia, CA 93277
3. Call (559) 624-7000 for questions

Common permit types:
- Residential new construction
- Room additions and remodels
- Accessory Dwelling Units (ADUs)
- Solar panel installations
- Agricultural buildings
- Commercial construction

Required documents vary by project but typically include: site plan, floor plans, structural calculations, Title 24 energy compliance forms.

Fees are based on project valuation. A typical residential remodel permit ranges from $500-$2,000.

Processing times: Simple permits (solar, water heaters) can be same-day. Standard residential permits take 2-4 weeks. Complex commercial projects may take 6-8 weeks.

Inspections can be scheduled by calling (559) 624-7000 or through the online portal.',
       0
FROM departments d WHERE d.slug = 'rma'
ON CONFLICT DO NOTHING;

-- Birth Certificates / Vital Records
INSERT INTO content_chunks (department_id, source_url, title, content, chunk_index)
SELECT d.id,
       'https://tularecounty.ca.gov/county-clerk/vital-records/',
       'Birth Certificates and Vital Records',
       'The Tulare County Clerk-Recorder office provides copies of birth certificates, death certificates, and marriage certificates for events that occurred in Tulare County.

Birth Certificate copies:
- Authorized certified copy: $25 (first copy), $10 each additional
- Informational copy: $25
- Available for births registered in Tulare County

How to request:
1. In person at the County Clerk office: 221 S Mooney Blvd, Rm 105, Visalia, CA 93291
2. By mail: Send a completed application with payment and a copy of valid photo ID
3. Call (559) 636-5050 for information

Required identification: Valid government-issued photo ID (driver license, passport, military ID). The requester must be the registrant, parent, legal guardian, or authorized representative.

Office hours: Monday-Friday, 8:00 AM - 5:00 PM (closed county holidays)

Marriage licenses: $91 fee. Both parties must appear in person with valid ID. No blood test or waiting period required in California.

Death certificates: $25 per copy. Available to authorized family members or legal representatives.',
       0
FROM departments d WHERE d.slug = 'clerk'
ON CONFLICT DO NOTHING;

-- Animal Services
INSERT INTO content_chunks (department_id, source_url, title, content, chunk_index)
SELECT d.id,
       'https://tularecounty.ca.gov/animal-services/',
       'Tulare County Animal Services',
       'Tulare County Animal Services provides animal control, sheltering, adoption, and licensing services.

Animal Shelter location: 24437 Ave 196, Tulare, CA 93274
Phone: (559) 636-4050
Hours: Tuesday-Saturday, 9:00 AM - 4:00 PM (closed Sunday-Monday)

Services offered:
- Pet adoptions (dogs, cats, rabbits, and other animals)
- Lost and found pets
- Dog licensing (required for all dogs in Tulare County)
- Spay/neuter programs
- Animal cruelty investigations
- Stray animal pickup

Dog licensing:
- Altered (spayed/neutered): $20/year
- Unaltered: $100/year
- Senior citizen discount available
- Proof of rabies vaccination required

Adoption fees: $75 for dogs, $50 for cats (includes spay/neuter, vaccinations, and microchip)

To report a stray, injured, or dangerous animal, call (559) 636-4050 during business hours or (559) 733-6218 after hours for emergencies.

Low-cost spay/neuter vouchers are available for Tulare County residents. Call for current availability.',
       0
FROM departments d WHERE d.slug = 'animal'
ON CONFLICT DO NOTHING;

-- County Office Hours / General Information
INSERT INTO content_chunks (department_id, source_url, title, content, chunk_index)
SELECT d.id,
       'https://tularecounty.ca.gov/government/contact-us/',
       'County of Tulare - General Information and Office Hours',
       'County of Tulare Government Center
Administration Building: 2800 W Burrel Ave, Visalia, CA 93291
Main Phone: (559) 636-5000

General office hours: Monday-Friday, 8:00 AM - 5:00 PM
Closed on county holidays including: New Year Day, Martin Luther King Jr. Day, Presidents Day, Memorial Day, Independence Day, Labor Day, Veterans Day, Thanksgiving (2 days), Christmas.

Board of Supervisors:
The Tulare County Board of Supervisors meets on the 1st and 3rd Tuesday of each month at 9:00 AM in the Board Chambers, 2800 W Burrel Ave, Visalia.

Key department contacts:
- Health & Human Services Agency (HHSA): (559) 624-8000
- Resource Management Agency (RMA): (559) 624-7000
- County Clerk-Recorder: (559) 636-5050
- Treasurer-Tax Collector: (559) 636-5250
- Sheriff Department: (559) 733-6218
- Animal Services: (559) 636-4050
- Public Works: (559) 624-7190

County population: approximately 486,000 residents
County seat: Visalia
Total area: 4,839 square miles

The County of Tulare website (tularecounty.ca.gov) provides online services including property tax payments, permit applications, and public records requests.',
       0
FROM departments d WHERE d.slug = 'general'
ON CONFLICT DO NOTHING;

-- Medi-Cal / Health Insurance
INSERT INTO content_chunks (department_id, source_url, title, content, chunk_index)
SELECT d.id,
       'https://tchhsa.org/eng/index.cfm/hhsa-services/health-care/',
       'Medi-Cal and Health Coverage in Tulare County',
       'Medi-Cal is California free or low-cost health insurance program for eligible residents. Tulare County HHSA helps residents apply for and maintain Medi-Cal coverage.

How to apply:
1. Online at BenefitsCal.com or CoveredCA.com
2. In person at HHSA: 5957 S Mooney Blvd, Visalia, CA 93277
3. By phone: (559) 624-8000

Eligibility: Based on income, household size, age, disability status, and other factors. Many adults qualify with income up to 138% of the federal poverty level.

Covered services include: Doctor visits, hospital care, prescriptions, mental health services, dental (Denti-Cal), vision, substance abuse treatment, and preventive care.

No monthly premium for most Medi-Cal recipients. Some may have a small share of cost.

Application processing: Typically 45 days. Emergency Medi-Cal can be processed more quickly.

Managed care plans in Tulare County: Health Net and Kaweah Health Plan.

Renewal: Medi-Cal must be renewed annually. HHSA will send renewal forms by mail. Respond promptly to avoid losing coverage.',
       0
FROM departments d WHERE d.slug = 'hhsa'
ON CONFLICT DO NOTHING;

-- Property Tax Information
INSERT INTO content_chunks (department_id, source_url, title, content, chunk_index)
SELECT d.id,
       'https://tularecounty.ca.gov/treasurer-tax-collector/',
       'Property Tax Information - Tulare County',
       'The Tulare County Treasurer-Tax Collector office handles property tax collection.

Office: 221 S Mooney Blvd, Rm 104E, Visalia, CA 93291
Phone: (559) 636-5250
Hours: Monday-Friday, 8:00 AM - 5:00 PM

Property tax due dates:
- 1st installment: Due November 1, delinquent December 10
- 2nd installment: Due February 1, delinquent April 10

Payment methods:
- Online at tularecounty.ca.gov (credit card, e-check)
- By mail with payment stub
- In person at the Tax Collector office
- Drop box located at 221 S Mooney Blvd

A 10% penalty is added to delinquent payments. After June 30, additional fees and interest apply.

Tax rate: Approximately 1% of assessed value plus voter-approved bonds and assessments. The average total tax rate in Tulare County is approximately 1.1-1.2%.

Supplemental tax bills may be issued when property is purchased or new construction is completed.

For questions about assessed values or to file an assessment appeal, contact the Assessor office at (559) 636-5100.',
       0
FROM departments d WHERE d.slug = 'general'
ON CONFLICT DO NOTHING;
