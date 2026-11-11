// Client-side French toggle.
//
// Strategy: a dictionary keyed on the EXACT English string. On switch-to-French we
// walk visible text nodes (and a few human-readable attributes) and swap any string
// present in FR / FR_ATTR. This keeps index.html untouched (no per-element keys) and
// is inherently safe — only curated matches are replaced, so emails, phone numbers,
// and the logo SVG are never altered. Anything not in the dictionary falls back to
// English, never to a broken state. Switching back to English does a full reload
// (the shipped HTML is English), so no need to cache originals.
//
// Keys must use the DECODED characters the browser sees in a text node, e.g. "&amp;"
// in the HTML source is the key character "&"; "&reg;" is "®"; "&mdash;" is "—".

// ===== BEGIN TRANSLATION DICTIONARY (draft — pending human review) =====
const FR = {
  // Fable content streamlining. Keys match decoded English text.
  "API-enabled workflows": "Flux de travail intégrant l’API",
  "Administrators and system engineers, developers and integration engineers, solution architects, business analysts, CMDB/Discovery/SAM specialists and process consultants.": "Administrateurs et ingénieurs systèmes, développeurs et ingénieurs en intégration, architectes de solutions, analystes métier, spécialistes CMDB/Discovery/SAM et consultants en processus.",
  "Agree the boundaries set out above.": "Convenez des limites définies ci-dessus.",
  "Are you a ServiceNow or Halo professional?": "Vous êtes un professionnel ServiceNow ou Halo ?",
  "As a Full Halo Technology Alliance Partner, EquaCore is authorised to implement, configure and support all three Halo products.": "En tant que Full Halo Technology Alliance Partner, EquaCore est autorisé à mettre en œuvre, configurer et prendre en charge les trois produits Halo.",
  "Assessment covers technical skills, communication and enterprise readiness. Every professional in our pool holds at least one of: ITIL 4 Foundation (or higher), ServiceNow CSA (or higher), or a HaloITSM, HaloPSA or HaloCRM product certification.": "L’évaluation porte sur les compétences techniques, la communication et l’aptitude à intervenir en entreprise. Chaque professionnel de notre vivier détient au moins l’une des certifications suivantes : ITIL 4 Foundation (ou supérieure), ServiceNow CSA (ou supérieure), ou une certification produit HaloITSM, HaloPSA ou HaloCRM.",
  "Building Nigeria's ServiceNow and Halo talent": "Développer les talents ServiceNow et Halo au Nigeria",
  "Built by service management practitioners": "Fondé par des praticiens de la gestion des services",
  "CMDB Health Check — a ServiceNow advisory assessment of configuration data.": "Bilan de santé CMDB — une évaluation des données de configuration dans le cadre d’une mission de conseil ServiceNow.",
  "ChatGPT can support individual and team work within an organisation-managed environment.": "ChatGPT peut accompagner le travail individuel et collectif dans un environnement géré par l’organisation.",
  "Choose the OpenAI product that fits the work.": "Choisissez le produit OpenAI adapté au travail à réaliser.",
  "Consultants are mentored before and during placement.": "Les consultants bénéficient d’un mentorat avant et pendant leur mission.",
  "Contact EquaCore Digital to discuss ServiceNow or Halo talent, platform implementation, managed operations or advisory in Nigeria, West Africa, the UK and Europe.": "Contactez EquaCore Digital pour discuter de talents ServiceNow ou Halo, de mise en œuvre de plateformes, d’exploitation gérée ou de conseil au Nigeria, en Afrique de l’Ouest, au Royaume-Uni et en Europe.",
  "Continuous platform support, enhancement and optimisation after go-live.": "Support, amélioration et optimisation continus de la plateforme après la mise en production.",
  "Discuss a HaloITSM QuickStart": "Discuter d’un QuickStart HaloITSM",
  "Discuss an ITSM Health Check": "Discuter d’un bilan ITSM",
  "Each stage ends with a decision or a documented output, so adoption progresses on evidence and with clear ownership.": "Chaque étape se termine par une décision ou un résultat documenté, afin que l’adoption progresse sur la base de preuves et avec des responsabilités clairement définies.",
  "Each stage hands off clearly to the next, and what we learn in operation sets the priorities for improvement.": "Chaque étape assure une transition claire vers la suivante, et les enseignements tirés de l’exploitation définissent les priorités d’amélioration.",
  "Each stage produces evidence for the next decision, and evaluation and feedback set the priorities for improvement.": "Chaque étape apporte des éléments pour la décision suivante, et l’évaluation ainsi que les retours définissent les priorités d’amélioration.",
  "EquaCore Digital is a Full Halo Technology Alliance Partner implementing HaloITSM, HaloPSA, and HaloCRM — covering migrations, process alignment, onboarding, and post-go-live managed support.": "EquaCore Digital est Full Halo Technology Alliance Partner et met en œuvre HaloITSM, HaloPSA et HaloCRM — migrations, alignement des processus, accompagnement des utilisateurs et support géré après la mise en production.",
  "EquaCore Digital is a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner, with independent ServiceNow services. Founded by service management practitioners and based in Lagos, Nigeria.": "EquaCore Digital est Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner et OpenAI Partner, et propose des services ServiceNow indépendants. L’entreprise a été fondée par des praticiens de la gestion des services et est basée à Lagos, au Nigeria.",
  "EquaCore Digital is a Nigeria-based team of ServiceNow specialists headquartered in Lagos. We place pre-vetted ServiceNow administrators, developers, solution architects and business analysts, run managed operations and provide independent advisory for organisations in Nigeria and across West Africa, with delivery that extends to clients in the UK and Europe.": "EquaCore Digital est une équipe de spécialistes ServiceNow basée au Nigeria, dont le siège se trouve à Lagos. Nous plaçons des administrateurs, développeurs, architectes de solutions et analystes métier ServiceNow présélectionnés, assurons l’exploitation gérée et proposons un conseil indépendant aux organisations au Nigeria et en Afrique de l’Ouest, avec des prestations également destinées à des clients au Royaume-Uni et en Europe.",
  "EquaCore Digital is based in Lagos, Nigeria, and works with organisations in Nigeria, across West Africa, the UK and Europe.": "EquaCore Digital est basé à Lagos, au Nigeria, et travaille avec des organisations au Nigeria, en Afrique de l’Ouest, au Royaume-Uni et en Europe.",
  "EquaCore develops Nigeria's ServiceNow and Halo talent through mentorship and upskilling.": "EquaCore développe les talents ServiceNow et Halo au Nigeria grâce au mentorat et au renforcement des compétences.",
  "Every engagement has a written scope, a named lead and change control. Work outside the agreed scope is discussed and written down before it is added.": "Chaque mission repose sur un périmètre écrit, un responsable désigné et une gestion des changements. Les travaux hors du périmètre convenu sont discutés et consignés par écrit avant d’être ajoutés.",
  "Explore all services →": "Découvrir tous les services →",
  "Explore engagement models →": "Découvrir les modèles d’engagement →",
  "For ServiceNow and Halo platform specialists (HaloITSM, HaloPSA, HaloCRM) open to permanent, contract, or embedded opportunities with organisations in Nigeria, West Africa, the UK and Europe. Register your interest in two minutes — we’ll be in touch when a fit emerges.": "Pour les spécialistes des plateformes ServiceNow et Halo (HaloITSM, HaloPSA, HaloCRM) intéressés par un poste permanent, un contrat ou une mission intégrée auprès d’organisations au Nigeria, en Afrique de l’Ouest, au Royaume-Uni et en Europe. Inscrivez-vous en deux minutes — nous vous contacterons lorsqu’une opportunité correspondra à votre profil.",
  "For engineering teams: agreed repository conventions, permission boundaries, test and review gates, and usage guidance.": "Pour les équipes d’ingénierie : conventions de dépôt convenues, limites d’autorisation, étapes de validation par les tests et la revue, et consignes d’utilisation.",
  "For leaders evaluating, optimising, or rationalising their ServiceNow estate.": "Pour les responsables qui évaluent, optimisent ou rationalisent leur environnement ServiceNow.",
  "Halo licenses its products with modules included as standard. Product capabilities and licensing are provided and maintained by Halo; confirm fit against current Halo documentation and your operating requirements.": "Halo propose ses produits sous licence avec les modules inclus en standard. Les fonctionnalités des produits et les conditions de licence sont fournies et maintenues par Halo ; vérifiez leur adéquation à l’aide de la documentation Halo à jour et de vos besoins opérationnels.",
  "Halo product questions": "Questions sur les produits Halo",
  "Halo specialists for your team": "Des spécialistes Halo pour votre équipe",
  "HaloITSM QuickStart — a fixed-scope HaloITSM implementation for organisations that need a working service desk.": "HaloITSM QuickStart — une mise en œuvre HaloITSM à périmètre défini pour les organisations qui ont besoin d’un centre de services opérationnel.",
  "How EquaCore Digital works with you: independent advisory, project-based delivery, ongoing support, embedded consulting and hybrid models — each with a written scope, a named lead and change control.": "Comment EquaCore Digital travaille avec vous : conseil indépendant, livraison par projet, support continu, conseil intégré et modèles hybrides — chacun avec un périmètre écrit, un responsable désigné et une gestion des changements.",
  "ITIL-aligned IT and Enterprise Service Management — Incident, Problem, Change, CMDB, Asset Management, Service Catalogue, and more.": "Gestion des services IT et d’entreprise alignée sur ITIL — incidents, problèmes, changements, CMDB, gestion des actifs, catalogue de services et plus encore.",
  "Implementation and improvement across Freshservice and Freshworks solutions, including workflows, integrations and user enablement.": "Mise en œuvre et amélioration des solutions Freshservice et Freshworks, notamment les flux de travail, les intégrations et l’accompagnement des utilisateurs.",
  "Implementation and improvement across HaloITSM, HaloPSA, HaloCRM, Freshservice and Freshworks solutions.": "Mise en œuvre et amélioration de HaloITSM, HaloPSA, HaloCRM, Freshservice et des solutions Freshworks.",
  "Implementation, migration and managed support across HaloITSM, HaloPSA and HaloCRM.": "Mise en œuvre, migration et support géré pour HaloITSM, HaloPSA et HaloCRM.",
  "Independent ServiceNow services from a Nigeria-based practice: pre-vetted talent, ongoing managed operations and advisory for organisations in Nigeria, West Africa, the UK and Europe.": "Des services ServiceNow indépendants proposés par un cabinet basé au Nigeria : talents présélectionnés, exploitation gérée continue et conseil pour les organisations au Nigeria, en Afrique de l’Ouest, au Royaume-Uni et en Europe.",
  "Independent ServiceNow talent, managed operations and advisory": "Talents, exploitation gérée et conseil ServiceNow indépendants",
  "Licence & Module Rationalisation": "Rationalisation des licences et des modules",
  "Migration from existing tools": "Migration depuis les outils existants",
  "Nigeria-based ServiceNow specialists — pre-vetted talent, hands-on managed operations, and independent advisory for organisations using the ServiceNow® platform in Nigeria, West Africa, the UK and Europe.": "Des spécialistes ServiceNow basés au Nigeria — talents présélectionnés, exploitation gérée de terrain et conseil indépendant pour les organisations qui utilisent la plateforme ServiceNow® au Nigeria, en Afrique de l’Ouest, au Royaume-Uni et en Europe.",
  "Omnichannel CRM unifying sales, marketing, and customer service. Pipelines, campaigns, ticketing, and AI-powered lead scoring.": "CRM omnicanal réunissant les ventes, le marketing et le service client. Pipelines, campagnes, gestion des tickets et notation des prospects assistée par l’IA.",
  "Ongoing managed operations and independent advisory for the ServiceNow® platform.": "Exploitation gérée continue et conseil indépendant pour la plateforme ServiceNow®.",
  "Ongoing platform administration, enhancement delivery and optimisation after go-live.": "Administration continue de la plateforme, livraison d’améliorations et optimisation après la mise en production.",
  "OpenAI offers different products for individual work, organisational knowledge and application workflows.": "OpenAI propose différents produits pour le travail individuel, les connaissances de l’organisation et les flux de travail applicatifs.",
  "Opens Microsoft Bookings in a new tab. We use your details only to respond to this request, as described in our": "Ouvre Microsoft Bookings dans un nouvel onglet. Nous utilisons vos coordonnées uniquement pour répondre à cette demande, comme indiqué dans notre",
  "Our ServiceNow® services are independent.": "Nos services ServiceNow® sont indépendants.",
  "Our team checks your CV and stated specialism within one business day.": "Notre équipe examine votre CV et la spécialité déclarée dans un délai d’un jour ouvré.",
  "Permanent placement, fixed-term contract or embedded squads.": "Placement permanent, contrat à durée déterminée ou équipes intégrées.",
  "Platform delivery and specialist talent for organisations across West Africa.": "Mise en œuvre de plateformes et talents spécialisés pour les organisations en Afrique de l’Ouest.",
  "Platform services, specialist talent and technology partnerships. Our ServiceNow® services remain independent.": "Services de plateforme, talents spécialisés et partenariats technologiques. Nos services ServiceNow® restent indépendants.",
  "Pre-vetted ServiceNow and Halo administrators, system engineers, developers, integration engineers, solution architects, business analysts, CMDB/Discovery/SAM specialists and process consultants for clients in Nigeria, West Africa, the UK and Europe.": "Des administrateurs, ingénieurs systèmes, développeurs, ingénieurs en intégration, architectes de solutions, analystes métier, spécialistes CMDB/Discovery/SAM et consultants en processus ServiceNow et Halo présélectionnés, pour des clients au Nigeria, en Afrique de l’Ouest, au Royaume-Uni et en Europe.",
  "Pre-vetted ServiceNow and Halo professionals for embedded teams, contracts or permanent placement.": "Des professionnels ServiceNow et Halo présélectionnés pour des équipes intégrées, des contrats ou un placement permanent.",
  "Pre-vetted ServiceNow and Halo professionals for embedded teams, fixed-term contracts or permanent placement. Our talent base is primarily Nigerian; we work with clients in the UK, Europe and across West Africa.": "Des professionnels ServiceNow et Halo présélectionnés pour des équipes intégrées, des contrats à durée déterminée ou un placement permanent. Notre vivier de talents est principalement nigérian ; nous travaillons avec des clients au Royaume-Uni, en Europe et en Afrique de l’Ouest.",
  "Pre-vetted ServiceNow professionals for embedded teams, fixed-term contracts or permanent placement. Every consultant is technically assessed and mentored before placement.": "Des professionnels ServiceNow présélectionnés pour des équipes intégrées, des contrats à durée déterminée ou un placement permanent. Chaque consultant fait l’objet d’une évaluation technique et bénéficie d’un mentorat avant son placement.",
  "Professional Services Automation built for MSPs, cloud providers, and telecoms. Ticketing, billing, contracts, time tracking, and CRM — in one platform.": "Automatisation des services professionnels conçue pour les prestataires de services gérés, les fournisseurs cloud et les télécoms. Tickets, facturation, contrats, suivi du temps et CRM — sur une seule plateforme.",
  "Query tuning, indexing and scheduled-job optimisation to keep the platform responsive.": "Optimisation des requêtes, de l’indexation et des tâches planifiées pour préserver la réactivité de la plateforme.",
  "Responsible Claude adoption: practical use-case design, integrations with permissions and approval points, and human oversight.": "Adoption responsable de Claude : conception de cas d’usage concrets, intégrations avec autorisations et points d’approbation, et supervision humaine.",
  "Send us a message →": "Envoyez-nous un message →",
  "ServiceNow & Halo talent for your team": "Des talents ServiceNow et Halo pour votre équipe",
  "ServiceNow Talent, Managed Operations & Independent Advisory — EquaCore Digital": "Talents ServiceNow, exploitation gérée et conseil indépendant — EquaCore Digital",
  "ServiceNow and Halo professionals": "Professionnels ServiceNow et Halo",
  "ServiceNow release upgrades and patching on a planned cycle, with regression testing before rollout.": "Mises à niveau des versions ServiceNow et application des correctifs selon un cycle planifié, avec des tests de non-régression avant le déploiement.",
  "Start with a process and a defined user need, then choose the Claude product, knowledge sources, tools and controls that support it.": "Partez d’un processus et d’un besoin utilisateur défini, puis choisissez le produit Claude, les sources de connaissances, les outils et les contrôles qui y répondent.",
  "Structured mentorship and upskilling that prepare professionals for enterprise delivery.": "Un mentorat structuré et un renforcement des compétences qui préparent les professionnels à intervenir en entreprise.",
  "Structured migrations from other ITSM, PSA or CRM platforms, with data-integrity checks.": "Des migrations structurées depuis d’autres plateformes ITSM, PSA ou CRM, avec des contrôles d’intégrité des données.",
  "Tell us the role, platform and start date you need.": "Indiquez-nous le poste, la plateforme et la date de début souhaités.",
  "Tell us what you are implementing, improving or staffing.": "Décrivez-nous vos projets de mise en œuvre, d’amélioration ou de recrutement.",
  "Tell us where your team is based and what you need.": "Dites-nous où se trouve votre équipe et ce dont vous avez besoin.",
  "Tell us whether you are exploring a platform, improving what you have, or looking for ServiceNow or Halo talent.": "Dites-nous si vous étudiez une plateforme, améliorez votre environnement existant ou recherchez des talents ServiceNow ou Halo.",
  "Tell us which Halo product you are considering and where you are starting from.": "Indiquez-nous le produit Halo que vous envisagez et votre situation de départ.",
  "Tell us your situation and we'll recommend the model that fits.": "Décrivez-nous votre situation et nous vous recommanderons le modèle adapté.",
  "The OpenAI API can support application workflows that retrieve approved information and use narrowly scoped tools, with human approval before sensitive or consequential actions.": "L’API OpenAI peut accompagner des flux de travail applicatifs qui récupèrent des informations approuvées et utilisent des outils au périmètre limité, avec une approbation humaine avant toute action sensible ou ayant des conséquences importantes.",
  "The same delivery approach applies to all three products, from scoping through go-live and support.": "La même approche de mise en œuvre s’applique aux trois produits, du cadrage à la mise en production et au support.",
  "United Kingdom": "Royaume-Uni",
  "Use narrowly scoped tools to prepare work, recommend next steps or support actions, with human approval before anything sensitive or consequential.": "Utilisez des outils au périmètre limité pour préparer le travail, recommander les prochaines étapes ou accompagner des actions, avec une approbation humaine avant toute opération sensible ou ayant des conséquences importantes.",
  "We agree what is in, what is out and how we will know it is done before delivery starts.": "Nous convenons de ce qui est inclus, de ce qui est exclu et de la façon de vérifier que le travail est terminé avant le début de la mission.",
  "We assess eight areas of the operation before recommending any tooling.": "Nous évaluons huit domaines du fonctionnement des services avant de recommander des outils.",
  "We help organisations adopt and integrate OpenAI — ChatGPT workspaces, API-enabled workflows, connected knowledge and AI-assisted delivery — with human approval and operating ownership designed in.": "Nous aidons les organisations à adopter et intégrer OpenAI — espaces de travail ChatGPT, flux intégrant l’API, connaissances connectées et réalisation assistée par l’IA — en prévoyant dès la conception l’approbation humaine et les responsabilités d’exploitation.",
  "We hold no ServiceNow reseller, partner, or licensing arrangement. Our recommendations reflect what's best for your platform.": "Nous n’avons aucun accord de revente, de partenariat ou de licence avec ServiceNow. Nos recommandations reflètent ce qui convient le mieux à votre plateforme.",
  "We offer Independent Strategy & Review, Project-Based Delivery, Ongoing Support & Optimisation, Embedded Consulting & Staff Augmentation and Hybrid Delivery Models.": "Nous proposons le conseil stratégique et la revue indépendants, la livraison par projet, le support et l’optimisation continus, le conseil intégré et le renfort d’effectifs, ainsi que les modèles de livraison hybrides.",
  "We recommend what fits your operation. Discovery ends with a costed recommendation for the right tooling — even if the answer isn't us. Our ServiceNow® services are independent.": "Nous recommandons ce qui convient à votre fonctionnement. La phase de découverte se termine par une recommandation chiffrée des outils adaptés — même si la réponse n’est pas EquaCore. Nos services ServiceNow® sont indépendants.",
  "We review data quality, CSDM alignment (ServiceNow's Common Service Data Model), Discovery and Service Mapping coverage, and ownership, then provide findings and prioritised improvement recommendations so you can see what to fix first.": "Nous examinons la qualité des données, l’alignement sur le CSDM (Common Service Data Model de ServiceNow), la couverture de Discovery et de Service Mapping ainsi que les responsabilités, puis fournissons des constats et des recommandations d’amélioration priorisées pour que vous sachiez quoi corriger en premier.",
  "We typically respond within one business day.": "Nous répondons généralement dans un délai d’un jour ouvré.",
  "We use your details only to respond to this request, as described in our": "Nous utilisons vos coordonnées uniquement pour répondre à cette demande, comme indiqué dans notre",
  "We work with UK organisations on platform delivery, independent ServiceNow services and specialist talent.": "Nous travaillons avec des organisations britanniques sur la mise en œuvre de plateformes, les services ServiceNow indépendants et les talents spécialisés.",
  "We’ve got your enquiry and will be in touch within one business day.": "Nous avons reçu votre demande et vous contacterons dans un délai d’un jour ouvré.",
  "West Africa": "Afrique de l’Ouest",
  "Where we work": "Où nous intervenons",
  "Where we work — EquaCore Digital": "Où nous intervenons — EquaCore Digital",
  "Where we work →": "Où nous intervenons →",
  "Within one business day, we confirm receipt and match against open opportunities.": "Dans un délai d’un jour ouvré, nous confirmons la réception et comparons votre profil aux opportunités disponibles.",
  "Work outside the agreed scope is discussed and written down before it is added.": "Les travaux hors du périmètre convenu sont discutés et consignés par écrit avant d’être ajoutés.",
  "Yes. EquaCore Digital is a Full Halo Technology Alliance Partner, authorised to implement and support HaloITSM, HaloPSA and HaloCRM.": "Oui. EquaCore Digital est Full Halo Technology Alliance Partner, autorisé à mettre en œuvre et prendre en charge HaloITSM, HaloPSA et HaloCRM.",
  "Yes. Our talent base is primarily Nigerian, and we work with clients in the UK, Europe and across West Africa.": "Oui. Notre vivier de talents est principalement nigérian, et nous travaillons avec des clients au Royaume-Uni, en Europe et en Afrique de l’Ouest.",
  "Your registration is now in our system. We’ll review your profile within one business day and reach out when a relevant opportunity emerges.": "Votre inscription est désormais enregistrée dans notre système. Nous examinerons votre profil dans un délai d’un jour ouvré et vous contacterons lorsqu’une opportunité pertinente se présentera.",
  "is an omnichannel customer relationship platform for sales, marketing, and customer service teams. As a Full Halo Technology Alliance Partner, EquaCore can implement and support any or all three.": "est une plateforme de relation client omnicanale destinée aux équipes commerciales, marketing et de service client. En tant que Full Halo Technology Alliance Partner, EquaCore peut mettre en œuvre et prendre en charge un ou plusieurs de ces trois produits.",
  "permanent placement, fixed-term contract, and embedded squads.": "placement permanent, contrat à durée déterminée et équipes intégrées.",

  // Labelled delivery sequences.
  "Intake": "Réception",
  "Routing": "Routage",
  "Owner": "Responsable",
  "Workflow": "Flux de travail",
  "Integration": "Intégration",
  "Email": "E-mail",
  "Portal": "Portail",
  "Chat": "Chat",
  "Handover": "Transmission",
  "Measure & learn": "Mesurer et apprendre",
  "Feedback": "Retours",
  "Developers": "Développeurs",
  "Technical Consultants": "Consultants techniques",
  "Administrators": "Administrateurs",
  "Business Analysts": "Analystes métier",
  "Skills review": "Bilan technique",
  "Mentorship": "Mentorat",
  "Readiness": "Préparation",
  "Requests move from intake and ownership through connected workflows and user enablement to review and measured improvement.": "Les demandes passent de la réception et de la prise en charge aux flux connectés et à l’accompagnement des utilisateurs, puis à la revue et à l’amélioration mesurée.",
  "Email, portal and chat requests enter a five-stage EquaCore delivery sequence: intake, routing to an owner, workflow integration, user guidance and handover, then review and feedback into the next cycle. This is an abstract delivery diagram.": "Les demandes par e-mail, portail et chat suivent cinq étapes de livraison EquaCore : réception, attribution à un responsable, intégration des flux, accompagnement et transmission, puis revue et retours pour le cycle suivant. Ce schéma est une représentation abstraite du processus de livraison.",
  "Specialist roles progress through skills assessment, mentorship and readiness for an embedded delivery team.": "Les profils spécialistes passent par l’évaluation des compétences, le mentorat et la préparation à l’intégration dans une équipe de livraison.",
  "Generic profiles represent Developers, Technical Consultants, Administrators and Business Analysts. Three distinct roles are visible at a time, moving through skills review, mentorship and team readiness. The illustration describes a process, not staffing capacity.": "Des profils génériques représentent les développeurs, consultants techniques, administrateurs et analystes métier. Trois rôles distincts sont visibles à la fois et passent par le bilan technique, le mentorat et la préparation à l’intégration. Ce schéma décrit un processus, pas une capacité de recrutement.",
  // Scoped service offers and delivery commitments.
  "Familiar problems": "Des situations fréquentes",
  "If these sound familiar, the ITSM Health Check maps the operation and shows what to fix first.": "Si cela vous parle, le bilan ITSM cartographie l’organisation et indique quoi corriger en premier.",
  "HaloITSM QuickStart": "HaloITSM QuickStart",
  "HaloITSM QuickStart →": "HaloITSM QuickStart →",
  "A fixed-scope HaloITSM implementation for organisations that need a working service desk. What is included, what is excluded, the timetable and the acceptance basis are agreed after discovery and confirmed in a written scope before work begins.": "Une implémentation HaloITSM à périmètre fixe pour les organisations qui ont besoin d’un centre de services opérationnel. Les éléments inclus et exclus, le calendrier et les modalités de réception sont convenus après la phase de découverte et confirmés dans un périmètre écrit avant le début des travaux.",
  "What the QuickStart covers": "Ce que couvre le QuickStart",
  "Working service desk setup for request and incident handling": "Configuration d’un centre de services opérationnel pour la gestion des demandes et des incidents",
  "Service catalogue, so users can see and request the services you agree to include": "Catalogue de services permettant aux utilisateurs de consulter et de demander les services que vous convenez d’inclure",
  "SLA configuration for those services": "Configuration des engagements de service pour ces services",
  "Operational reporting for ticket volumes and SLA performance": "Rapports opérationnels sur les volumes de tickets et le respect des engagements de service",
  "Structured onboarding and knowledge transfer so your team can run the desk": "Prise en main structurée et transfert de connaissances pour que votre équipe puisse gérer le centre de services",
  "What is scoped separately": "Ce qui fait l’objet d’un périmètre distinct",
  "Migration from legacy tools, complex integrations with other systems, HaloPSA or HaloCRM, and ongoing managed support after go-live are not part of the QuickStart. Those can be planned as separate, written scopes if you need them. Broader HaloITSM capabilities, such as change, CMDB, major incident or automation, can also be added after discovery if they are required; they are not assumed in the QuickStart.": "La migration depuis des outils existants, les intégrations complexes avec d’autres systèmes, HaloPSA ou HaloCRM, ainsi que le support managé continu après la mise en service ne font pas partie du QuickStart. Si vous en avez besoin, ces prestations peuvent être planifiées dans des périmètres écrits distincts. Des fonctionnalités HaloITSM plus larges, comme la gestion des changements, la CMDB, les incidents majeurs ou l’automatisation, peuvent aussi être ajoutées après la phase de découverte si elles sont nécessaires ; elles ne sont pas incluses d’office dans le QuickStart.",
  "Timing": "Calendrier",
  "There is no standard calendar deadline. After a short discovery we agree the plan, dependencies and acceptance criteria, and confirm them in a written scope before delivery starts.": "Il n’y a pas de délai calendaire standard. Après une courte phase de découverte, nous convenons du plan, des dépendances et des critères de réception, puis les confirmons dans un périmètre écrit avant le début de la livraison.",
  "Access to the HaloITSM environment, named service owners, existing catalogue or SLA information where it exists, and time with the people who will own the service desk after go-live.": "Un accès à l’environnement HaloITSM, des responsables de services désignés, les informations existantes sur le catalogue ou les engagements de service lorsqu’elles sont disponibles, et du temps avec les personnes qui seront responsables du centre de services après la mise en service.",
  "How we accept the work": "Comment nous validons la réception des travaux",
  "Acceptance is against the written scope: the agreed service desk, catalogue, SLAs, reporting and onboarding are in place as described there. Anything added later is agreed through change control.": "La réception se fait selon le périmètre écrit : le centre de services, le catalogue, les engagements de service, les rapports et la prise en main convenus sont en place conformément à ce document. Tout ajout ultérieur est convenu dans le cadre de la gestion des changements.",
  "CMDB Health Check": "Bilan de santé CMDB",
  "CMDB Health Check →": "Bilan de santé CMDB →",
  "Can you trust your CMDB? This is a ServiceNow advisory assessment of configuration data, not a platform-neutral operational Health Check.": "Pouvez-vous faire confiance à votre CMDB ? Il s’agit d’une évaluation de conseil ServiceNow portant sur les données de configuration, et non d’un bilan opérationnel indépendant des plateformes.",
  "The findings and recommendations are yours to act on. Implementation work, if you want it, is a separate discussion.": "Les constats et les recommandations vous appartiennent pour agir. Les travaux de mise en œuvre, si vous le souhaitez, font l’objet d’une discussion distincte.",
  "Discuss a CMDB Health Check": "Discuter d’un bilan de santé CMDB",
  "How we run an engagement": "Comment nous menons une mission",
  "Every engagement starts with an agreed scope, a named lead and a written definition of done.": "Chaque mission commence par un périmètre convenu, un responsable désigné et une définition écrite des critères de réalisation.",
  "Scope in writing first": "Le périmètre écrit avant tout",
  "We agree what is in, what is out, and how we will know it is done, and we confirm that in writing before delivery starts.": "Nous convenons de ce qui est inclus, de ce qui est exclu et de la façon dont nous saurons que le travail est terminé, puis le confirmons par écrit avant le début de la livraison.",
  "A named lead": "Un responsable désigné",
  "One accountable EquaCore lead owns the engagement and is your point of contact.": "Un responsable EquaCore unique est chargé de la mission et constitue votre point de contact.",
  "Change control": "Gestion des changements",
  "Work that sits outside the agreed scope is discussed and written down before it is added.": "Les travaux qui sortent du périmètre convenu sont discutés et consignés par écrit avant d’être ajoutés.",

  // ---- Global / nav ----
  "Skip to content": "Aller au contenu",
  "Home": "Accueil",
  "Services": "Services",
  "Overview": "Vue d'ensemble",
  "Halo Services": "Services Halo",
  "Talent Augmentation": "Renfort de talents",
  "Engagement Models": "Modèles d'engagement",
  "About": "À propos",
  "About EquaCore": "À propos d'EquaCore",
  "Markets Served": "Marchés desservis",
  "Contact": "Contact",

  // ---- ITSM Health Check ----
  "Health Check": "Bilan ITSM",
  "ITSM Health Check": "Bilan ITSM",
  "Explore the ITSM Health Check →": "Découvrir le bilan ITSM →",
  "ITSM Health Check · Platform-neutral": "Bilan ITSM · Indépendant des plateformes",
  "See where your service operation breaks, and what to fix first.": "Identifiez les points de rupture de votre organisation de services et les améliorations à traiter en priorité.",
  "A structured assessment of how requests, incidents and changes really move through your organisation. You get a scored maturity report and a prioritised roadmap, whether you run Halo, Freshservice, ServiceNow®, or email and spreadsheets.": "Une évaluation structurée du parcours réel des demandes, incidents et changements dans votre organisation. Vous recevez un rapport de maturité noté et une feuille de route priorisée, que vous utilisiez Halo, Freshservice, ServiceNow®, ou des e-mails et des tableurs.",
  "Health and Maturity Report": "Rapport de santé et de maturité",
  "Current-state map of how work arrives and moves today": "Cartographie de la situation actuelle : comment le travail arrive et circule aujourd’hui",
  "Maturity score for each assessed area": "Score de maturité pour chaque domaine évalué",
  "Gap analysis with root causes, not just symptoms": "Analyse des écarts et de leurs causes profondes, au-delà des symptômes",
  "Prioritised roadmap of what to fix, in what order, and why": "Feuille de route priorisée : quoi améliorer, dans quel ordre et pourquoi",
  "Leadership readout to walk your team through the findings": "Restitution à la direction pour présenter les constats à votre équipe",
  "The report and roadmap belong to you.": "Le rapport et la feuille de route vous appartiennent.",
  "Signs it is time": "Les signes à reconnaître",
  "When the operation needs a closer look.": "Quand le fonctionnement des services mérite un examen approfondi.",
  "If two or more of these sound familiar, buying another tool will not fix it. Understanding the operation will.": "Si vous reconnaissez au moins deux de ces situations, acheter un autre outil ne résoudra pas le problème. Comprendre le fonctionnement de vos services est la première étape.",
  "Requests arrive everywhere": "Les demandes arrivent de partout",
  "Email, WhatsApp, calls and walk-ups, with no single record of what was asked.": "E-mails, WhatsApp, appels et sollicitations directes, sans registre unique des demandes.",
  "Nobody can see the SLAs": "Personne ne voit les engagements de service",
  "You learn something is late when a senior stakeholder complains.": "Vous découvrez un retard lorsqu’un responsable se plaint.",
  "Ownership is unclear": "Les responsabilités sont floues",
  "Work moves between teams with no named owner and no record of the handoff.": "Le travail passe d’une équipe à l’autre sans responsable désigné ni trace du transfert.",
  "Escalation depends on who you know": "L’escalade dépend des relations personnelles",
  "Urgent issues get fixed through relationships rather than defined paths.": "Les urgences sont résolues grâce aux relations personnelles plutôt qu’à des circuits définis.",
  "Reports count tickets, not value": "Les rapports comptent les tickets, pas la valeur",
  "Leadership sees volumes, not workload, recurring issues or service quality.": "La direction voit des volumes, sans visibilité sur la charge, les problèmes récurrents ou la qualité de service.",
  "The tool is owned, not used": "L’outil est acheté, mais pas utilisé",
  "You bought a platform, but teams work around it.": "Vous avez acheté une plateforme, mais les équipes la contournent.",
  "What we assess": "Ce que nous évaluons",
  "The operation first. Tools second.": "Le fonctionnement des services d’abord. Les outils ensuite.",
  "Intake and channels": "Réception des demandes et canaux",
  "How requests and incidents arrive, and what gets lost on the way.": "Comment les demandes et incidents arrivent, et ce qui se perd en chemin.",
  "Service catalogue": "Catalogue de services",
  "Whether users know what they can ask for, and how.": "Les utilisateurs savent-ils ce qu’ils peuvent demander et comment le faire ?",
  "Incident, problem and change": "Incidents, problèmes et changements",
  "How work is categorised, resolved, prevented and controlled.": "Comment le travail est catégorisé, résolu, prévenu et contrôlé.",
  "SLAs and escalation": "Engagements de service et escalade",
  "Targets, how they are measured, and what happens when they slip.": "Les objectifs, leur mesure et les mesures prises lorsqu’ils ne sont pas atteints.",
  "Roles and ownership": "Rôles et responsabilités",
  "Who owns services, queues and decisions.": "Qui est responsable des services, des files de traitement et des décisions.",
  "Reporting and KPIs": "Rapports et indicateurs de performance",
  "What leadership sees, and what it should see.": "Ce que la direction voit et ce qu’elle devrait voir.",
  "Tooling fit": "Adéquation des outils",
  "Whether your current platform supports the operation you need.": "Votre plateforme actuelle soutient-elle le fonctionnement dont vous avez besoin ?",
  "Whether people use the process and tools as designed.": "Les équipes utilisent-elles les processus et les outils comme prévu ?",
  "How it works": "Comment cela fonctionne",
  "Four steps, one clear outcome.": "Quatre étapes, un résultat clair.",
  "Scope": "Cadrage",
  "A short call to agree which teams, services and tools are in scope.": "Un court échange pour convenir des équipes, services et outils à inclure.",
  "Workshops with service owners and a review of your data, tools and reports.": "Des ateliers avec les responsables de services et un examen de vos données, outils et rapports.",
  "Score and prioritise": "Noter et prioriser",
  "Each area scored against a maturity model, with fixes ranked by impact.": "Chaque domaine est noté selon un modèle de maturité, avec des améliorations classées par impact.",
  "Readout": "Restitution",
  "We present the report and roadmap to your leadership team.": "Nous présentons le rapport et la feuille de route à votre équipe de direction.",
  "What we need from you": "Ce dont nous avons besoin de votre part",
  "Access to the right people for workshops, read access to your current tool or trackers, and a sponsor for the readout.": "L’accès aux personnes concernées pour les ateliers, un accès en lecture à votre outil ou à vos fichiers de suivi actuels, et un sponsor pour la restitution.",
  "Your roadmap, your decision.": "Votre feuille de route, votre décision.",
  "Implementation after the report is a separate discussion. The report and roadmap remain yours to act on, with EquaCore or without.": "La mise en œuvre après le rapport fait l’objet d’une discussion distincte. Le rapport et la feuille de route restent à votre disposition pour agir, avec ou sans EquaCore.",
  "A platform-neutral assessment of how requests, incidents and changes move through your organisation, with a Health and Maturity Report and a prioritised roadmap that belong to you.": "Une évaluation indépendante des plateformes du parcours des demandes, incidents et changements dans votre organisation, avec un rapport de santé et de maturité et une feuille de route priorisée qui vous appartiennent.",
  "The ITSM Health Check is a defined-scope assessment with a customer-owned report and roadmap.": "Le bilan ITSM est une évaluation au périmètre défini, avec un rapport et une feuille de route qui appartiennent au client.",
  "ITSM Health Check — EquaCore Digital": "Bilan ITSM — EquaCore Digital",
  "A platform-neutral assessment of your service operation, with a customer-owned Health and Maturity Report, scored assessment areas and a prioritised roadmap.": "Une évaluation indépendante des plateformes de votre organisation de services, avec un rapport de santé et de maturité appartenant au client, des domaines évalués et notés et une feuille de route priorisée.",

  // ---- Services-first home ----
  "Independent ServiceNow services": "Services ServiceNow indépendants",
  "See the three offers": "Voir les trois offres",
  "View partner relationships": "Voir nos relations partenaires",
  "Platform": "Plateforme",
  "Operations": "Opérations",
  "People": "Personnes",
  "Discover": "Découvrir",
  "Deliver": "Livrer",
  "Transfer": "Transférer",
  "Structured governance": "Gouvernance structurée",
  "Knowledge transfer": "Transfert de compétences",
  "Core services": "Services principaux",
  "Three clear ways we help.": "Trois façons claires de vous aider.",
  "Choose platform delivery, independent operations support or specialist talent—with the scope made clear before work begins.":
    "Choisissez la livraison de plateforme, le support opérationnel indépendant ou des talents spécialisés, avec un périmètre clarifié avant le début des travaux.",
  "Platform delivery": "Livraison de plateforme",
  "Independent services": "Services indépendants",
  "ServiceNow® services": "Services ServiceNow®",
  "Ongoing managed operations": "Opérations managées en continu",
  "Advisory and health checks": "Conseil et bilans de santé plateforme",
  "Process design and optimisation": "Conception et optimisation des processus",
  "Independent; no reseller or licensing arrangement": "Indépendant ; aucun accord de revente ou de licence",
  "Technical assessment": "Évaluation technique",
  "Mentorship and readiness": "Mentorat et préparation",
  "Flexible engagement structures": "Formats d'engagement flexibles",
  "Partner relationships": "Relations partenaires",
  "Four distinct relationships.": "Quatre relations distinctes.",
  "These relationships sit alongside our work in Talent, Managed Services, and Advisory. Our ServiceNow® services are independent.":
    "Ces relations complètent nos activités de talents, de services gérés et de conseil. Nos services ServiceNow® sont indépendants.",
  "Freshworks Partner": "Partenaire Freshworks",
  "Digital and process improvement": "Amélioration numérique et des processus",
  "Better processes.": "De meilleurs processus.",
  "Smarter digital operations.": "Des opérations numériques plus intelligentes.",
  "We help organisations improve service delivery, simplify workflows and embed sustainable digital operations through platform implementation, independent advisory, managed support and specialist talent.":
    "Nous aidons les organisations à améliorer la prestation de services, à simplifier les flux de travail et à ancrer des opérations numériques durables grâce à l'implémentation de plateformes, au conseil indépendant, au support géré et à des talents spécialisés.",
  "Platform implementation & improvement": "Implémentation et amélioration de plateformes",
  "Specialist talent": "Talents spécialisés",
  "Improvement system": "Système d'amélioration",
  "Processes": "Processus",
  "Platforms": "Plateformes",
  "Design": "Concevoir",
  "Improve": "Améliorer",
  "Embed": "Intégrer",
  "Sustain": "Pérenniser",
  "Clear outcomes": "Résultats clairs",
  "Digital platform delivery": "Livraison de plateformes numériques",
  "Workflow and process design": "Conception des flux de travail et des processus",
  "Migrations and integrations": "Migrations et intégrations",
  "User enablement and optimisation": "Accompagnement des utilisateurs et optimisation",
  "Halo and Freshworks solutions": "Solutions Halo et Freshworks",
  "Implement": "Implémenter",
  "Assess": "Évaluer",
  "Operate": "Exploiter",
  "Advise": "Conseiller",
  "Develop": "Développer",
  "Configure": "Configurer",
  "Enable": "Accompagner",
  "Independent delivery": "Livraison indépendante",
  "Mentored and enterprise-ready": "Accompagnés et prêts pour l'entreprise",
  "Explore Halo services →": "Découvrir les services Halo →",
  "Explore Freshworks services →": "Découvrir les services Freshworks →",
  "Claude Adoption": "Adoption de Claude",
  "Explore Claude adoption →": "Découvrir l'adoption de Claude →",
  "Responsible Claude adoption shaped around use-case discovery, organisational knowledge, integrations, human oversight, rollout and evaluation.":
    "Une adoption responsable de Claude structurée autour de la découverte des cas d'usage, des connaissances de l'organisation, des intégrations, de la supervision humaine, du déploiement et de l'évaluation.",
  "Explore Claude Adoption →": "Découvrir l'adoption de Claude →",

  // ---- ENG-33 Freshworks page ----
  "Freshworks Services": "Services Freshworks",
  "Implementation and improvement across selected Freshworks solutions, from process mapping and workflow design to integrations, migration, enablement and ongoing optimisation.":
    "Implémentation et amélioration de solutions Freshworks sélectionnées, de la cartographie des processus et la conception des flux de travail aux intégrations, à la migration, à l'accompagnement et à l'optimisation continue.",
  "Explore Freshworks →": "Découvrir Freshworks →",
  "Freshworks delivery, shaped around": "Une livraison Freshworks conçue pour",
  "better service.": "un meilleur service.",
  "We help organisations implement and improve selected Freshworks solutions, covering workflow configuration, integrations, data migration, user enablement and ongoing optimisation to strengthen service delivery and customer support.":
    "Nous aidons les organisations à implémenter et à améliorer certaines solutions Freshworks, en couvrant la configuration des flux de travail, les intégrations, la migration des données, l'accompagnement des utilisateurs et l'optimisation continue afin de renforcer la prestation de services et le support client.",
  "Explore the product fit": "Explorer l'adéquation des produits",
  "Freshworks product fit": "Adéquation des produits Freshworks",
  "One product family. Different operational needs.": "Une famille de produits. Des besoins opérationnels différents.",
  "Freshworks provides products across IT and employee service, customer support, conversations, voice, sales and marketing. We help select and shape the parts that fit the process you need to improve.":
    "Freshworks propose des produits pour les services IT et aux employés, le support client, les conversations, la voix, les ventes et le marketing. Nous aidons à sélectionner et à façonner les éléments adaptés au processus que vous devez améliorer.",
  "IT and employee service": "Services IT et services aux employés",
  "Freshservice brings IT service management, asset management, operations management and enterprise service management capabilities into a unified service environment.":
    "Freshservice réunit les capacités de gestion des services IT, de gestion des actifs, de gestion des opérations et de gestion des services d'entreprise dans un environnement de service unifié.",
  "IT service workflows": "Flux de services IT",
  "Assets and operations": "Actifs et opérations",
  "Enterprise service management": "Gestion des services d'entreprise",
  "Customer service": "Service client",
  "Freshdesk supports email-led ticketing, collaboration and automation. Freshdesk Omni connects email, chat, WhatsApp, social and portal support in one workspace, with phone available as an add-on.":
    "Freshdesk prend en charge la gestion des tickets centrée sur l'e-mail, la collaboration et l'automatisation. Freshdesk Omni relie l'e-mail, le chat, WhatsApp, les réseaux sociaux et les portails dans un même espace de travail, la téléphonie étant disponible en option.",
  "Conversation and voice": "Conversation et voix",
  "Freshchat supports messaging, live chat and bot-assisted self-service across digital channels. Freshcaller provides cloud contact-centre voice capabilities including IVR and call routing, and can work with Freshdesk.":
    "Freshchat prend en charge la messagerie, le chat en direct et le libre-service assisté par des bots sur les canaux numériques. Freshcaller fournit des capacités vocales de centre de contact dans le cloud, notamment le serveur vocal interactif et le routage des appels, et peut fonctionner avec Freshdesk.",
  "Sales and marketing": "Ventes et marketing",
  "Freshsales is the sales-focused CRM. Freshsales Suite brings sales and marketing together, while Freshmarketer supports multichannel marketing automation.":
    "Freshsales est le CRM axé sur les ventes. Freshsales Suite réunit les ventes et le marketing, tandis que Freshmarketer prend en charge l'automatisation marketing multicanale.",
  "Shared foundation": "Socle commun",
  "The Freshworks Platform supports custom workflows and applications, integrations, custom objects, analytics, unified administration and developer tools across the product environment.":
    "La plateforme Freshworks prend en charge les flux de travail et applications sur mesure, les intégrations, les objets personnalisés, l'analytique, l'administration unifiée et les outils de développement dans l'environnement produit.",
  "Capabilities and availability vary by product, edition and plan. Product fit should be confirmed against current Freshworks documentation and your operating requirements.":
    "Les capacités et la disponibilité varient selon le produit, l'édition et l'offre. L'adéquation du produit doit être confirmée à partir de la documentation Freshworks à jour et de vos besoins opérationnels.",
  "Clear delivery boundaries": "Des limites de livraison claires",
  "Product capability and delivery support, kept distinct.": "Capacités produit et accompagnement de livraison, clairement distingués.",
  "Freshworks builds the products. EquaCore helps organisations translate process needs into a practical implementation and improvement programme.":
    "Freshworks conçoit les produits. EquaCore aide les organisations à traduire leurs besoins de processus en un programme pratique d'implémentation et d'amélioration.",
  "How EquaCore helps": "Comment EquaCore vous accompagne",
  "Process-led implementation and improvement": "Implémentation et amélioration guidées par les processus",
  "Discovery and process mapping, solution and workflow design, configuration, integrations, data migration, user enablement, rollout, ongoing optimisation and support.":
    "Découverte et cartographie des processus, conception de la solution et des flux de travail, configuration, intégrations, migration des données, accompagnement des utilisateurs, déploiement, optimisation continue et support.",
  "Delivery lifecycle": "Cycle de livraison",
  "From process clarity to sustained improvement": "De la clarté des processus à l'amélioration durable",
  "Map the current process, users, data and constraints.": "Cartographier le processus actuel, les utilisateurs, les données et les contraintes.",
  "Define the target workflow, product fit and integration needs.": "Définir le flux cible, l'adéquation du produit et les besoins d'intégration.",
  "Build workflows, connections and migration paths around the agreed design.": "Construire les flux, les connexions et les parcours de migration autour de la conception convenue.",
  "Prepare users, rollout activities and knowledge transfer.": "Préparer les utilisateurs, les activités de déploiement et le transfert de compétences.",
  "Support operations and use feedback to prioritise ongoing optimisation.": "Soutenir les opérations et utiliser les retours pour prioriser l'optimisation continue.",
  "Where could Freshworks simplify your operation?": "Où Freshworks pourrait-il simplifier vos opérations ?",
  "Bring the process, service or customer-support challenge. We will help frame the product fit and delivery path.":
    "Présentez-nous votre défi de processus, de service ou de support client. Nous vous aiderons à cadrer l'adéquation du produit et le parcours de livraison.",
  "Book a 30-minute discussion": "Réserver une discussion de 30 minutes",
  "Send us a message": "Nous envoyer un message",

  // ---- ENG-34 Anthropic / Claude adoption page ----
  "Responsible Claude adoption": "Adoption responsable de Claude",
  "Claude adoption, designed around": "L'adoption de Claude, conçue autour du",
  "real work.": "travail réel.",
  "We help organisations move from promising ideas to governed, useful Claude workflows—prioritising the right use cases, connecting knowledge and tools, keeping people in control, and improving against clear measures.":
    "Nous aidons les organisations à passer d'idées prometteuses à des flux Claude utiles et gouvernés : prioriser les bons cas d'usage, relier les connaissances et les outils, maintenir le contrôle humain et s'améliorer selon des mesures claires.",
  "Explore where Claude can fit": "Explorer où Claude peut s'intégrer",
  "Work": "Travail",
  "Knowledge": "Connaissances",
  "People": "Personnes",
  "Claude workflow": "Flux Claude",
  "Human review": "Validation humaine",
  "Prioritise": "Prioriser",
  "Connect": "Connecter",
  "Govern": "Gouverner",
  "Responsible Claude adoption journey": "Parcours d'adoption responsable de Claude",
  "Operational inputs move through Discover, Prioritise, Connect, Govern and Improve. Human review sits inside the governed workspace and evaluation feeds the next cycle.":
    "Les éléments opérationnels passent par les étapes Découvrir, Prioriser, Connecter, Gouverner et Améliorer. La validation humaine est intégrée à l'espace gouverné et l'évaluation alimente le cycle suivant.",
  "Claude in context": "Claude dans son contexte",
  "Where Claude can fit in the operation.": "Où Claude peut s'intégrer dans les opérations.",
  "Organisational knowledge": "Connaissances de l'organisation",
  "Claude Projects and connected knowledge": "Projets Claude et connaissances connectées",
  "Structure relevant working context, curate sources, define access expectations and establish ownership for keeping knowledge useful over time.":
    "Structurez le contexte de travail pertinent, sélectionnez les sources, définissez les règles d'accès et attribuez la responsabilité de maintenir les connaissances utiles dans le temps.",
  "Source selection": "Sélection des sources",
  "Knowledge curation": "Gestion des connaissances",
  "Access design": "Conception des accès",
  "Integrated workflows": "Flux de travail intégrés",
  "Claude Platform and tool use": "Claude Platform et utilisation d'outils",
  "Connect Claude to approved tools and systems with explicit scopes, authentication, approval points, failure paths and operational ownership.":
    "Connectez Claude aux outils et systèmes approuvés avec des périmètres explicites, une authentification, des points d'approbation, des scénarios d'échec et une responsabilité opérationnelle.",
  "AI-assisted delivery": "Livraison assistée par l'IA",
  "Claude Code workflows": "Flux de travail Claude Code",
  "Product availability, connector behaviour and administrative controls vary by product, plan, permissions and configuration. Fit should be confirmed against current Anthropic documentation and your requirements.":
    "La disponibilité des produits, le comportement des connecteurs et les contrôles d'administration varient selon le produit, l'offre, les autorisations et la configuration. L'adéquation doit être confirmée à partir de la documentation Anthropic à jour et de vos besoins.",
  "Anthropic capability and EquaCore delivery, kept distinct.": "Capacités d'Anthropic et livraison d'EquaCore, clairement distinguées.",
  "Anthropic builds and maintains Claude products and the Claude Platform. EquaCore helps organisations turn an operating need into a governed adoption programme.":
    "Anthropic conçoit et maintient les produits Claude et la Claude Platform. EquaCore aide les organisations à transformer un besoin opérationnel en programme d'adoption gouverné.",
  "Process-led adoption and implementation": "Adoption et implémentation guidées par les processus",
  "Use-case discovery and prioritisation, workflow and data design, integration configuration, permissions and approval design, rollout, training, evaluation and continuous improvement.":
    "Découverte et priorisation des cas d'usage, conception des flux et des données, configuration des intégrations, conception des autorisations et des approbations, déploiement, formation, évaluation et amélioration continue.",
  "Governance and human oversight": "Gouvernance et supervision humaine",
  "Control is designed into the workflow.": "Le contrôle est intégré au flux de travail.",
  "Every use case needs explicit boundaries for what Claude can access, what it can do, when a person must review, and how performance is assessed.":
    "Chaque cas d'usage requiert des limites explicites sur ce à quoi Claude peut accéder, ce qu'il peut faire, quand une personne doit valider et comment la performance est évaluée.",
  "Permissions": "Autorisations",
  "Limit data and tool access to what the use case requires.": "Limitez l'accès aux données et aux outils à ce qu'exige le cas d'usage.",
  "Approval points": "Points d'approbation",
  "Keep meaningful human review before consequential actions.": "Conservez une validation humaine significative avant les actions à conséquence.",
  "Evaluation": "Évaluation",
  "Test representative tasks, edge cases and agreed success criteria.": "Testez des tâches représentatives, les cas limites et les critères de réussite convenus.",
  "Ownership": "Responsabilité",
  "Define monitoring, escalation and improvement responsibilities.": "Définissez les responsabilités de suivi, d'escalade et d'amélioration.",
  "Adoption lifecycle": "Cycle d'adoption",
  "From opportunity to an improving service": "De l'opportunité à un service qui s'améliore",
  "Map the work, users, knowledge, pain points and constraints.": "Cartographiez le travail, les utilisateurs, les connaissances, les difficultés et les contraintes.",
  "Compare value, feasibility, risk and readiness before selecting a pilot.": "Comparez la valeur, la faisabilité, le risque et la préparation avant de sélectionner un pilote.",
  "Design and connect": "Concevoir et connecter",
  "Shape the workflow, context, tools, permissions and failure paths.": "Concevez le flux, le contexte, les outils, les autorisations et les scénarios d'échec.",
  "Govern and test": "Gouverner et tester",
  "Set approval boundaries and evaluate representative tasks and edge cases.": "Définissez les limites d'approbation et évaluez des tâches représentatives ainsi que les cas limites.",
  "Prepare users, guidance, rollout support and operating ownership.": "Préparez les utilisateurs, les consignes, le support au déploiement et la responsabilité opérationnelle.",
  "Evaluate and improve": "Évaluer et améliorer",
  "Review usage and quality against agreed measures, then iterate.": "Examinez l'usage et la qualité selon les mesures convenues, puis améliorez par itérations.",
  "Where could Claude improve the way work gets done?": "Où Claude pourrait-il améliorer la manière dont le travail est réalisé ?",
  "Bring the process, knowledge challenge or delivery workflow. We will help frame a responsible adoption path.":
    "Présentez-nous le processus, le défi de connaissances ou le flux de livraison. Nous vous aiderons à cadrer un parcours d'adoption responsable.",

  // ---- ENG-37 OpenAI adoption and integration page ----
  "OpenAI Solutions": "Solutions OpenAI",
  "Explore OpenAI solutions →": "Découvrir les solutions OpenAI →",
  "OpenAI adoption and integration for ChatGPT workspaces, API-enabled workflows, connected knowledge and AI-assisted delivery—with human approval and operating ownership designed in.":
    "Adoption et intégration d'OpenAI pour les espaces de travail ChatGPT, les flux activés par API, les connaissances connectées et la livraison assistée par l'IA, avec validation humaine et responsabilité opérationnelle intégrées.",
  "Explore OpenAI Solutions →": "Découvrir les solutions OpenAI →",
  "OpenAI adoption and integration": "Adoption et intégration d'OpenAI",
  "OpenAI capability, shaped into": "Les capacités d'OpenAI, transformées en",
  "reliable work.": "travail fiable.",
  "We help organisations identify where OpenAI can be useful, connect approved knowledge and tools, design human control around consequential actions, and establish an operating path from pilot to ongoing improvement.":
    "Nous aidons les organisations à déterminer où OpenAI peut être utile, à connecter les connaissances et outils approuvés, à concevoir un contrôle humain autour des actions à conséquence et à établir un parcours opérationnel allant du pilote à l'amélioration continue.",
  "Explore the fit": "Explorer l'adéquation",
  "Systems": "Systèmes",
  "ChatGPT workspace": "Espace de travail ChatGPT",
  "API + tools": "API + outils",
  "OWNED OPERATION": "OPÉRATION MAÎTRISÉE",
  "Operational workflow": "Flux opérationnel",
  "Context, tools, controls": "Contexte, outils, contrôles",
  "Review": "Validation",
  "Assist": "Assister",
  "Act": "Agir",
  "Control": "Contrôler",
  "Controlled OpenAI workflow map": "Carte d'un flux OpenAI contrôlé",
  "People, knowledge and systems enter through ChatGPT workspace or API and tool connections. They converge in an owned workflow with human approval, then support assistance, action and improvement.":
    "Les personnes, les connaissances et les systèmes entrent par un espace de travail ChatGPT ou par des connexions API et outils. Ils convergent dans un flux maîtrisé avec validation humaine, puis soutiennent l'assistance, l'action et l'amélioration.",
  "OpenAI product capabilities": "Capacités des produits OpenAI",
  "ChatGPT workspaces": "Espaces de travail ChatGPT",
  "User enablement": "Accompagnement des utilisateurs",
  "Source-aware assistance and AI-assisted delivery": "Assistance avec sources et livraison assistée par l'IA",
  "Product availability, data handling, connectors, administrative controls and limits vary by selected OpenAI product, plan, permissions and configuration. Fit should be confirmed against current OpenAI documentation and your requirements.":
    "La disponibilité des produits, le traitement des données, les connecteurs, les contrôles d'administration et les limites varient selon le produit OpenAI, l'offre, les autorisations et la configuration choisis. L'adéquation doit être confirmée à partir de la documentation OpenAI à jour et de vos besoins.",
  "OpenAI products and EquaCore delivery, kept distinct.": "Produits OpenAI et livraison d'EquaCore, clairement distingués.",
  "OpenAI builds and maintains its models, products, APIs and platform controls. EquaCore helps organisations translate a work need into a controlled adoption and integration programme.":
    "OpenAI conçoit et maintient ses modèles, produits, API et contrôles de plateforme. EquaCore aide les organisations à traduire un besoin de travail en programme contrôlé d'adoption et d'intégration.",
  "Process-led adoption and integration": "Adoption et intégration guidées par les processus",
  "Use-case discovery, workflow and data design, integration configuration, access and approval design, user enablement, operational ownership, evaluation practices and ongoing improvement.":
    "Découverte des cas d'usage, conception des flux et des données, configuration des intégrations, conception des accès et des approbations, accompagnement des utilisateurs, responsabilité opérationnelle, pratiques d'évaluation et amélioration continue.",
  "Start with a real workflow, not a generic AI promise.": "Partez d'un flux réel, pas d'une promesse générique sur l'IA.",
  "Support analysis, drafting, coding or review inside established working practices, with representative tests and accountable human judgement.":
    "Soutenez l'analyse, la rédaction, le codage ou la revue dans le cadre de pratiques de travail établies, avec des tests représentatifs et un jugement humain responsable.",
  "Control before scale": "Contrôler avant de déployer à grande échelle",
  "Put ownership around every connection and action.": "Attribuez une responsabilité à chaque connexion et action.",
  "Useful adoption depends on standard security controls, explicit boundaries and human responsibility—not on a model or guardrail alone.":
    "Une adoption utile repose sur des contrôles de sécurité standard, des limites explicites et une responsabilité humaine, et non sur un modèle ou une barrière de sécurité seuls.",
  "Access and data": "Accès et données",
  "Define who can use the workflow and which approved information it can reach.": "Définissez qui peut utiliser le flux et à quelles informations approuvées il peut accéder.",
  "Tools and approvals": "Outils et approbations",
  "Scope each connection and require human approval before sensitive or consequential actions.": "Délimitez chaque connexion et exigez une approbation humaine avant les actions sensibles ou à conséquence.",
  "Test and review": "Test et revue",
  "Use representative tasks, edge cases and human review to assess quality and failure paths.": "Utilisez des tâches représentatives, des cas limites et une revue humaine pour évaluer la qualité et les scénarios d'échec.",
  "Operate and improve": "Exploiter et améliorer",
  "Assign monitoring, incident, escalation and improvement responsibilities after launch.": "Attribuez les responsabilités de suivi, d'incident, d'escalade et d'amélioration après le lancement.",
  "EquaCore delivery path": "Parcours de livraison EquaCore",
  "From useful opportunity to owned operation": "D'une opportunité utile à une opération maîtrisée",
  "Discover the work": "Découvrir le travail",
  "Map users, tasks, pain points and decide whether AI is an appropriate fit.": "Cartographiez les utilisateurs, les tâches et les difficultés, puis déterminez si l'IA est adaptée.",
  "Design the boundaries": "Concevoir les limites",
  "Build and connect": "Construire et connecter",
  "Configure the workspace or application workflow and its approved connections.": "Configurez l'espace de travail ou le flux applicatif et ses connexions approuvées.",
  "Validate and approve": "Valider et approuver",
  "Test representative work, review failures and confirm readiness with accountable owners.": "Testez des travaux représentatifs, examinez les échecs et confirmez la préparation avec les responsables désignés.",
  "Enable and improve": "Accompagner et améliorer",
  "Support adoption, monitor operation and prioritise changes from real evidence.": "Soutenez l'adoption, surveillez le fonctionnement et priorisez les changements à partir d'éléments réels.",
  "Where could OpenAI improve the way work gets done?": "Où OpenAI pourrait-il améliorer la manière dont le travail est réalisé ?",
  "Bring the process, knowledge challenge or delivery workflow. We will help assess the fit and frame a controlled adoption path.":
    "Présentez-nous le processus, le défi de connaissances ou le flux de livraison. Nous vous aiderons à évaluer l'adéquation et à cadrer un parcours d'adoption contrôlé.",
  "Explore all services": "Découvrir tous les services",

  // ---- Home hero ----
  "Full Halo Technology Alliance Partner": "Partenaire à part entière du Halo Technology Alliance",
  "Anthropic Partner": "Partenaire Anthropic",
  "OpenAI Partner": "Partenaire OpenAI",

  // ---- Core Offerings ----
  "Explore Halo Services →": "Découvrir les services Halo →",
  "Explore ServiceNow →": "Découvrir ServiceNow →",
  "Explore Talent →": "Découvrir nos talents →",
  "Pre-vetted ServiceNow professionals": "Professionnels ServiceNow présélectionnés",

  // ---- Approach ----
  "Our Approach": "Notre méthode",
  "From discovery to sustainable delivery": "De la découverte à une livraison durable",
  "Discovery": "Découverte",
  "We map your current operations and pain points — you get a written findings and fit assessment.":
    "Nous cartographions vos opérations actuelles et vos points de friction — vous recevez un rapport écrit et une évaluation d'adéquation.",
  "Platform Fit": "Adéquation plateforme",
  "A costed recommendation for the right tooling — even if the answer isn't us.":
    "Une recommandation chiffrée pour l'outil adapté — même si la réponse n'est pas nous.",
  "Adoption": "Adoption",
  "Structured delivery with weekly governance checkpoints, training, and a measured go-live.":
    "Une livraison structurée avec des points de gouvernance hebdomadaires, des formations et une mise en service maîtrisée.",
  "Knowledge Transfer": "Transfert de compétences",
  "Documented handover to your team. We leave when they no longer need us.":
    "Une passation documentée à votre équipe. Nous partons quand elle n'a plus besoin de nous.",

  // ---- Why EquaCore ----
  "Why EquaCore": "Pourquoi EquaCore",
  "Built on delivery discipline": "Construit sur la rigueur de livraison",
  "Configuring a platform is the easy part. We make sure it drives real operational improvement — and that your teams actually adopt it.":
    "Configurer une plateforme est la partie facile. Nous veillons à ce qu'elle produise une réelle amélioration opérationnelle — et que vos équipes se l'approprient vraiment.",

  // ---- Talent & Community (home) ----

  // ---- Topical density paragraph ----

  // ---- FAQ ----
  "FAQ": "FAQ",
  "Frequently Asked Questions": "Questions fréquentes",
  "Is EquaCore an official Halo partner?": "EquaCore est-il un partenaire Halo officiel ?",
  "Do you work with clients outside Nigeria?": "Travaillez-vous avec des clients en dehors du Nigeria ?",
  "What is the difference between HaloITSM, HaloPSA, and HaloCRM?": "Quelle est la différence entre HaloITSM, HaloPSA et HaloCRM ?",
  " is ITIL-aligned IT and Enterprise Service Management — ideal for organisations managing internal IT services, facilities, HR, and more.":
    " est une solution de gestion des services IT et d'entreprise alignée sur ITIL — idéale pour les organisations qui gèrent leurs services IT internes, leurs installations, leurs ressources humaines, et plus encore.",
  " (Professional Services Automation) is built for managed service providers and technology companies that need to manage client tickets, billing, contracts, time tracking, and projects in one place.":
    " (automatisation des services professionnels) est conçu pour les prestataires de services gérés et les entreprises technologiques qui doivent gérer en un seul endroit les tickets clients, la facturation, les contrats, le suivi du temps et les projets.",
  "All three are products from Halo Service Solutions built on the same platform, but designed for different audiences.":
    "Ces trois produits de Halo Service Solutions reposent sur la même plateforme, mais s'adressent à des publics différents.",
  "What engagement models does EquaCore offer?": "Quels modèles d'engagement EquaCore propose-t-il ?",

  // ---- CTA band (home) ----
  "See how we'd run your engagement — in 30 minutes.": "Découvrez comment nous mènerions votre mission — en 30 minutes.",
  "A working session with a practitioner, not a sales deck.": "Une session de travail avec un praticien, pas une présentation commerciale.",

  // ---- Services page ----
  "Our Services": "Nos services",
  "What We Deliver": "Ce que nous livrons",
  "ServiceNow Services": "Services ServiceNow",
  "Pre-vetted ServiceNow talent for placement and embedded teams, ongoing managed operations, and independent platform advisory. Supporting organisations using the ServiceNow® platform.":
    "Des talents ServiceNow présélectionnés pour le placement et les équipes intégrées, des opérations managées en continu et un conseil plateforme indépendant, au service des organisations qui utilisent la plateforme ServiceNow®.",

  // ---- ServiceNow page ----
  "ServiceNow in Nigeria": "ServiceNow au Nigeria",
  "ServiceNow Talent, Enterprise-Ready": "Des talents ServiceNow prêts pour l'entreprise",
  "Administrators & System Engineers": "Administrateurs et ingénieurs systèmes",
  "Day-to-day platform stewardship — user management, configuration, instance hygiene.":
    "La gestion quotidienne de la plateforme — gestion des utilisateurs, configuration, entretien de l'instance.",
  "Developers & Integration Engineers": "Développeurs et ingénieurs d'intégration",
  "Scripted automations, custom applications, and integrations with enterprise systems.":
    "Automatisations scriptées, applications sur mesure et intégrations avec les systèmes d'entreprise.",
  "Architects & Solution Designers": "Architectes et concepteurs de solutions",
  "Senior practitioners shaping platform strategy, technical design, and delivery roadmaps.":
    "Des praticiens confirmés qui définissent la stratégie plateforme, la conception technique et les feuilles de route de livraison.",
  "Business Analysts & Process Consultants": "Analystes métier et consultants processus",
  "Requirements, process mapping, and ITIL-aligned workflow design.":
    "Recueil des besoins, cartographie des processus et conception de flux alignée sur ITIL.",
  "CMDB, Discovery & SAM Specialists": "Spécialistes CMDB, Discovery et SAM",
  "Configuration data, asset management, and service mapping expertise.":
    "Données de configuration, gestion des actifs et expertise en cartographie des services.",
  "Engagement formats:": "Formats d'engagement :",
  "Are you a ServiceNow specialist? Join the talent pool": "Vous êtes spécialiste ServiceNow ? Rejoignez notre vivier de talents",
  "Managed Services": "Services gérés",
  "ServiceNow Operations, Done Right": "Une exploitation ServiceNow bien menée",
  "Ongoing managed operations keep your platform healthy as your organisation grows. Our team handles routine administration, incident response, and continuous tuning — with clear SLAs, transparent reporting, and predictable retainers.":
    "Des opérations managées en continu qui maintiennent votre plateforme en bonne santé à mesure que votre organisation grandit. Notre équipe assure l'administration courante, la réponse aux incidents et l'optimisation continue — avec des SLA clairs, un reporting transparent et des forfaits prévisibles.",
  "Platform Administration & User Management": "Administration de la plateforme et gestion des utilisateurs",
  "Routine configuration, role & group governance, instance hygiene.":
    "Configuration courante, gouvernance des rôles et groupes, entretien de l'instance.",
  "Incident, Problem & Change Support": "Support incidents, problèmes et changements",
  "Backstop for your ITIL processes — escalations handled, root causes found, changes governed.":
    "Un filet de sécurité pour vos processus ITIL — escalades traitées, causes racines identifiées, changements gouvernés.",
  "Patching & Release Cadence": "Cadence de correctifs et de mises en production",
  "Performance Monitoring & Tuning": "Suivi et optimisation des performances",
  "Continuous Improvement & Backlog": "Amélioration continue et backlog",
  "We grow your platform through iterative enhancements — not one-shot projects.":
    "Nous faisons évoluer votre plateforme par des améliorations itératives — pas par des projets ponctuels.",
  "How we engage:": "Comment nous intervenons :",
  " monthly retainer with named primary & secondary engineers, capacity-based hours, defined SLAs, and a quarterly business review.":
    " forfait mensuel avec ingénieurs principal et secondaire nommément désignés, heures allouées par capacité, SLA définis et un bilan trimestriel.",
  "Advisory & Optimisation": "Conseil et optimisation",
  "Independent ServiceNow Advisory": "Conseil ServiceNow indépendant",
  "Platform Health Assessments": "Bilans de santé de la plateforme",
  "Independent review of configuration, technical debt, security posture, and adoption.":
    "Un examen indépendant de la configuration, de la dette technique, de la posture de sécurité et de l'adoption.",
  "Process Design (ITIL-Aligned)": "Conception de processus (alignée ITIL)",
  "Workflow design that fits your operating model — not a generic best-practice template.":
    "Une conception de flux adaptée à votre modèle opérationnel — pas un modèle générique de bonnes pratiques.",
  "Optimisation Roadmaps": "Feuilles de route d'optimisation",
  "A prioritised, sequenced plan with effort estimates — what to do, in what order, and why.":
    "Un plan hiérarchisé et séquencé avec estimations d'effort — quoi faire, dans quel ordre, et pourquoi.",
  "User Adoption & Training": "Adoption utilisateurs et formation",
  "Adoption is a programme, not a manual. We design rollout, comms, and enablement plans.":
    "L'adoption est un programme, pas un manuel. Nous concevons le déploiement, la communication et les plans d'accompagnement.",
  "Right-size your subscription against actual usage — defensible recommendations, not vendor talking points.":
    "Ajustez votre abonnement à l'usage réel — des recommandations justifiables, pas des arguments d'éditeur.",
  "Need ServiceNow talent, ops support, or a second opinion?": "Besoin de talents ServiceNow, d'un support d'exploitation ou d'un second avis ?",
  "Tell us where you are — placement, managed services, or advisory — and we'll match the right team.":
    "Dites-nous où vous en êtes — placement, services gérés ou conseil — et nous composerons l'équipe adaptée.",

  // ---- Halo (haloitsm) page ----
  "Authorised to deliver the complete Halo platform — HaloITSM, HaloPSA, and HaloCRM — across full-lifecycle implementations, migrations, and managed operations.":
    "Habilités à livrer l'ensemble de la plateforme Halo — HaloITSM, HaloPSA et HaloCRM — de l'implémentation de bout en bout aux migrations et à l'exploitation gérée.",
  "The Halo Platform": "La plateforme Halo",
  "Three Products. One Partner.": "Trois produits. Un seul partenaire.",
  "For: Enterprises & IT Teams": "Pour : entreprises et équipes IT",
  "For: MSPs & Service Providers": "Pour : MSP et prestataires de services",
  "For: Customer-Facing Teams": "Pour : équipes en contact avec la clientèle",
  "Our Practice": "Notre pratique",
  "What We Deliver Across All Halo Products": "Ce que nous livrons sur l'ensemble des produits Halo",
  "Platform Implementation & Configuration": "Implémentation et configuration de la plateforme",
  "End-to-end deployment and configuration of any Halo product, tailored to your operational requirements and ITIL or business processes.":
    "Déploiement et configuration de bout en bout de n'importe quel produit Halo, adaptés à vos besoins opérationnels et à vos processus ITIL ou métier.",
  "Process Alignment & Automation": "Alignement et automatisation des processus",
  "Designing workflows and automations that reflect how your organisation actually works — not generic templates imposed from outside.":
    "Concevoir des flux et des automatisations qui reflètent le fonctionnement réel de votre organisation — pas des modèles génériques imposés de l'extérieur.",
  "User Onboarding & Knowledge Transfer": "Prise en main utilisateurs et transfert de compétences",
  "Structured onboarding so your team owns the platform from day one — not dependent on us for routine operations after go-live.":
    "Une prise en main structurée pour que votre équipe maîtrise la plateforme dès le premier jour — sans dépendre de nous pour les opérations courantes après la mise en service.",
  "Post-Go-Live Managed Support": "Support géré après mise en service",
  "Ready to implement a Halo product?": "Prêt à implémenter un produit Halo ?",

  // ---- Talent page ----
  "Book a 30-minute talent call": "Réserver un échange talents de 30 minutes",
  "Join Our Talent Pool": "Rejoindre notre vivier de talents",
  "Our Model": "Notre modèle",
  "Pre-Vetted Professionals": "Professionnels présélectionnés",
  "Mentorship & Development": "Mentorat et développement",
  "Flexible Engagement Structures": "Formats d'engagement flexibles",
  "Impact": "Impact",
  "Our Community Impact →": "Notre impact communautaire →",
  "Need ServiceNow or Halo talent?": "Besoin de talents ServiceNow ou Halo ?",
  "Register for our talent pool →": "Inscrivez-vous à notre vivier de talents →",

  // ---- Engagement page ----
  "How We Work With You": "Comment nous travaillons avec vous",
  "Advisory": "Conseil",
  "Independent Strategy & Review": "Stratégie et évaluation indépendantes",
  "Platform strategy, tooling assessment, and delivery review. For organisations that need an informed second opinion before committing to a platform or a programme.":
    "Stratégie de plateforme, évaluation des outils et revue de la livraison. Pour les organisations qui ont besoin d'un second avis éclairé avant de s'engager sur une plateforme ou un programme.",
  "Defined Scope": "Périmètre défini",
  "Project-Based Delivery": "Livraison au projet",
  "For defined implementations with clear scope, milestones, and deliverables. Ideal for new platform deployments, migrations, and targeted improvement projects.":
    "Pour des implémentations définies, avec un périmètre, des jalons et des livrables clairs. Idéal pour les nouveaux déploiements de plateforme, les migrations et les projets d'amélioration ciblés.",
  "Continuous": "Continu",
  "Ongoing Support & Optimisation": "Support et optimisation continus",
  "Integrated": "Intégré",
  "Embedded Consulting & Staff Augmentation": "Conseil intégré et renfort de personnel",
  "Place EquaCore professionals directly within your teams, bringing expertise while transferring knowledge to build internal capability.":
    "Intégrez des professionnels EquaCore directement au sein de vos équipes, apportant leur expertise tout en transférant des compétences pour renforcer vos capacités internes.",
  "Blended": "Combiné",
  "Hybrid Delivery Models": "Modèles de livraison hybrides",
  "Combine delivery and enablement in a single engagement. We implement while simultaneously upskilling your team.":
    "Combinez livraison et accompagnement dans une seule mission. Nous implémentons tout en montant en compétences votre équipe.",
  "Not sure which model fits?": "Vous hésitez sur le modèle adapté ?",

  // ---- Partner credentials (home hero + About) ----
  "Partnerships": "Partenariats",
  "Technology Partnerships": "Partenariats technologiques",
  "EquaCore Digital is a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner. These relationships sit alongside our work in Talent, Managed Services, and Advisory. Our ServiceNow® services are independent.":
    "EquaCore Digital est partenaire à part entière du Halo Technology Alliance, partenaire Freshworks, partenaire Anthropic et partenaire OpenAI. Ces relations complètent nos activités dans les domaines des talents, des services gérés et du conseil. Nos services ServiceNow® sont indépendants.",

  // ---- About page ----
  "EquaCore was founded by experienced service management professionals who believe in implementation over theory — discipline over shortcuts, and outcomes over activity.":
    "EquaCore a été fondé par des professionnels expérimentés de la gestion des services qui privilégient la mise en œuvre à la théorie, la rigueur aux raccourcis, et les résultats à l'activité.",
  "What drives us forward": "Ce qui nous fait avancer",
  "Our Mission": "Notre mission",
  "Combining deep expertise with scalable talent solutions": "Allier une expertise pointue à des solutions de talents évolutives",
  "To help organisations design, implement, and evolve modern digital operations by combining deep implementation expertise with scalable talent solutions.":
    "Aider les organisations à concevoir, implémenter et faire évoluer des opérations numériques modernes en alliant une expertise d'implémentation pointue à des solutions de talents évolutives.",
  "What We Stand For": "Ce que nous défendons",
  "The principles behind every engagement": "Les principes qui sous-tendent chaque mission",
  "Delivery Discipline": "Rigueur de livraison",
  "Our goal is your independence. We build internal capability so your team can own and evolve the solution — not create long-term dependency on us.":
    "Notre objectif est votre autonomie. Nous renforçons vos compétences internes pour que votre équipe puisse s'approprier et faire évoluer la solution — sans créer de dépendance durable envers nous.",
  "Community Focus": "Engagement communautaire",
  "We invest in the Nigerian tech ecosystem through mentorship, talent development, and ServiceNow community initiatives — growing the pool we draw from.":
    "Nous investissons dans l'écosystème technologique nigérian par le mentorat, le développement des talents et des initiatives communautaires ServiceNow — en faisant grandir le vivier dans lequel nous puisons.",
  "Client Partnership": "Partenariat client",
  "Community Impact": "Impact communautaire",
  "Growing the ecosystem": "Faire grandir l'écosystème",
  "We foster developer communities through meetups, hackathons, and talent enablement initiatives — creating a sustainable ecosystem that nurtures growth and collaboration across Africa.":
    "Nous soutenons les communautés de développeurs à travers des rencontres, des hackathons et des initiatives d'accompagnement des talents — pour créer un écosystème durable qui favorise la croissance et la collaboration à travers l'Afrique.",
  "Meetups & Hackathons": "Rencontres et hackathons",
  "Organising community events that bring together aspiring tech professionals for hands-on learning and collaboration.":
    "Organiser des événements communautaires qui réunissent des professionnels de la tech en devenir autour de l'apprentissage pratique et de la collaboration.",
  "Talent Enablement": "Accompagnement des talents",
  "Developer Ecosystem": "Écosystème de développeurs",
  "Growing a network of technologists and delivery leaders who back each other and raise the bar — beyond any single firm or platform.":
    "Faire grandir un réseau de spécialistes techniques et de responsables de livraison qui se soutiennent et élèvent le niveau — au-delà d'une seule entreprise ou plateforme.",
  "Ready to work with a team that delivers?": "Prêt à travailler avec une équipe qui livre ?",

  // ---- Markets page ----
  "Our Regions": "Nos régions",
  "Where We Operate": "Où nous opérons",
  "Nigeria": "Nigeria",
  "Primary market. Deep local expertise, talent network, and community initiatives.":
    "Marché principal. Expertise locale approfondie, réseau de talents et initiatives communautaires.",
  "Africa": "Afrique",
  "Europe": "Europe",
  "Supporting European organisations with consulting and talent augmentation.":
    "Nous accompagnons les organisations européennes avec du conseil et du renfort de talents.",
  "We work with IT and Operations leaders responsible for service delivery and platform strategy — across small, mid-market, and enterprise organisations at every stage of platform maturity.":
    "Nous travaillons avec des responsables IT et Opérations en charge de la livraison des services et de la stratégie plateforme — au sein de petites structures, d'entreprises intermédiaires et de grands comptes, à tous les stades de maturité de plateforme.",
  "Operating in your region?": "Vous opérez dans votre région ?",

  // ---- Contact page ----
  "Let's Talk": "Parlons-en",
  "Send Us a Message": "Envoyez-nous un message",
  "Full Name *": "Nom complet *",
  "Email Address *": "Adresse e-mail *",
  "Company / Organisation": "Entreprise / Organisation",
  "Platform of Interest": "Plateforme d'intérêt",
  "Message *": "Message *",
  "Other / Not sure": "Autre / Je ne sais pas",
  "Send Message": "Envoyer le message",
  "Get in Touch Directly": "Nous contacter directement",
  "General Enquiries": "Renseignements généraux",
  "Sales": "Ventes",
  "EquaCore Direct Line": "Ligne directe EquaCore",
  "Office": "Bureau",
  "Victoria Crest, Orchid Road,": "Victoria Crest, Orchid Road,",
  "Lekki, Lagos, Nigeria": "Lekki, Lagos, Nigeria",

  // ---- Talent-pool page ----
  "Talent Pool": "Vivier de talents",
  "Join the EquaCore Talent Pool": "Rejoindre le vivier de talents EquaCore",
  "Register Your Interest": "Inscrivez votre intérêt",
  "Fill in your details below and attach your CV. We'll be in touch when a relevant opportunity emerges.":
    "Remplissez vos informations ci-dessous et joignez votre CV. Nous vous recontacterons dès qu'une opportunité pertinente se présentera.",
  "Email *": "E-mail *",
  "Phone": "Téléphone",
  "Country *": "Pays *",
  "LinkedIn Profile": "Profil LinkedIn",
  "Primary Platform / Specialism *": "Plateforme / spécialité principale *",
  "Years of Experience": "Années d'expérience",
  "Availability": "Disponibilité",
  "Engagement Preference": "Préférence d'engagement",

  // ---- ENG-20: Halo talent roles + certification minimum ----
  "Halo Talent": "Talents Halo",
  "Certified Halo professionals available for permanent, contract, or embedded placement across HaloITSM, HaloPSA, and HaloCRM.": "Des professionnels Halo certifiés disponibles en placement permanent, en contrat ou en régie sur HaloITSM, HaloPSA et HaloCRM.",
  "Certified Halo Administrators": "Administrateurs Halo certifiés",
  "Day-to-day platform administration, configuration, and user support across HaloITSM, HaloPSA, and HaloCRM.": "Administration quotidienne de la plateforme, configuration et support utilisateur sur HaloITSM, HaloPSA et HaloCRM.",
  "Halo Implementation Specialists": "Spécialistes de l'implémentation Halo",
  "Consultants who take a Halo deployment from scoping through go-live, including migrations from legacy ITSM and PSA tools.": "Des consultants qui pilotent un déploiement Halo du cadrage à la mise en production, y compris les migrations depuis d'anciens outils ITSM et PSA.",
  "Halo Service Desk & Managed Support": "Halo Service Desk et support infogéré",
  "Service desk analysts and managed-support engineers who keep your Halo estate running long after launch.": "Des analystes de service desk et des ingénieurs de support infogéré qui maintiennent votre parc Halo bien après le lancement.",
  "Minimum certification requirement.": "Certification minimale requise.",
  "To join the talent pool you must hold at least one of: ITIL 4 Foundation (or higher); ServiceNow CSA (or higher); or a HaloITSM, HaloPSA, or HaloCRM product certification. Every professional currently in our pool meets this bar.": "Pour rejoindre le vivier de talents, vous devez détenir au moins l'une des certifications suivantes : ITIL 4 Foundation (ou supérieur) ; ServiceNow CSA (ou supérieur) ; ou une certification produit HaloITSM, HaloPSA ou HaloCRM. Tous les professionnels actuellement dans notre vivier satisfont à ce critère.",
  "I confirm I hold at least one of the qualifying credentials above: ITIL 4 Foundation (or higher), ServiceNow CSA (or higher), or a HaloITSM, HaloPSA, or HaloCRM product certification.": "Je confirme détenir au moins l'une des certifications qualifiantes ci-dessus : ITIL 4 Foundation (ou supérieur), ServiceNow CSA (ou supérieur), ou une certification produit HaloITSM, HaloPSA ou HaloCRM.",

  "Certifications *": "Certifications *",
  "Cover Note": "Lettre de motivation",
  "CV — PDF or Word *": "CV — PDF ou Word *",
  "Multiple platforms": "Plusieurs plateformes",
  "Other": "Autre",
  "0–2 years": "0 à 2 ans",
  "3–5 years": "3 à 5 ans",
  "6–9 years": "6 à 9 ans",
  "10+ years": "10 ans et plus",
  "Immediately": "Immédiatement",
  "Within 2 weeks": "Sous 2 semaines",
  "Within 1 month": "Sous 1 mois",
  "Within 3 months": "Sous 3 mois",
  "Not actively looking": "Pas en recherche active",
  "Permanent": "Permanent",
  "Contract": "Contrat",
  "Embedded / staff augmentation": "Intégré / renfort de personnel",
  "Open to any": "Ouvert à tout",
  "I consent to EquaCore Digital storing my details and CV for recruitment purposes. See our ":
    "J'accepte qu'EquaCore Digital conserve mes informations et mon CV à des fins de recrutement. Voir notre ",
  "privacy policy": "politique de confidentialité",
  "Submit Application": "Envoyer ma candidature",
  "What Happens Next": "Et ensuite ?",
  "Here's our process from registration to placement.": "Voici notre processus, de l'inscription jusqu'au placement.",
  "1. Submit your registration": "1. Envoyez votre inscription",
  "Your CV and details land directly in our system within seconds.": "Votre CV et vos informations arrivent directement dans notre système en quelques secondes.",
  "2. We review your profile": "2. Nous examinons votre profil",
  "3. We connect you with employers": "3. Nous vous mettons en relation avec des employeurs",
  "When a relevant role emerges, we reach out before sharing your profile with anyone.":
    "Dès qu'un poste pertinent se présente, nous vous contactons avant de partager votre profil avec qui que ce soit.",
  "Questions? Email ": "Des questions ? Écrivez à ",

  // ---- Privacy policy ----
  "How EquaCore Digital collects, uses, and protects your personal information.":
    "Comment EquaCore Digital collecte, utilise et protège vos informations personnelles.",
  "Legal": "Mentions légales",
  "Privacy Policy": "Politique de confidentialité",
  "Last updated:": "Dernière mise à jour :",
  "Data Controller:": "Responsable du traitement :",
  "EquaCore Digital Ltd (registered in Nigeria)": "EquaCore Digital Ltd (immatriculée au Nigeria)",
  "Contact:": "Contact :",
  "1. Who we are": "1. Qui nous sommes",
  "EquaCore Digital Ltd (\"EquaCore\", \"we\", \"us\", \"our\") is a digital operations consulting firm ":
    "EquaCore Digital Ltd (« EquaCore », « nous », « notre ») est un cabinet de conseil en opérations numériques ",
  "incorporated in the Federal Republic of Nigeria, with global operations":
    "immatriculé en République fédérale du Nigeria, avec des activités à l'échelle mondiale",
  ". This Privacy Policy explains how we collect, use, and protect personal information when you use ":
    ". Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons les informations personnelles lorsque vous utilisez ",
  ", submit our enquiry or talent pool forms, or otherwise interact with us.":
    ", que vous soumettez nos formulaires de contact ou d'inscription au vivier de talents, ou que vous interagissez avec nous d'une autre manière.",
  "Because our operations are global and we engage with candidates, clients, and partners across multiple jurisdictions, we hold ourselves to the higher of the applicable standards. Specifically, we comply with:":
    "Nos activités étant mondiales et nos échanges avec des candidats, clients et partenaires couvrant plusieurs juridictions, nous nous imposons le niveau d'exigence le plus élevé applicable. Nous respectons notamment :",
  "The": "",
  "Nigeria Data Protection Act 2023": "La loi nigériane de 2023 sur la protection des données",
  " (NDPA), enforced by the Nigeria Data Protection Commission (NDPC) — our primary regulatory framework":
    " (NDPA), appliquée par la Commission nigériane de protection des données (NDPC) — notre cadre réglementaire principal",
  "UK General Data Protection Regulation": "Le règlement britannique sur la protection des données (UK GDPR)",
  " (UK GDPR) and the Data Protection Act 2018 — for data subjects in the United Kingdom":
    " et le Data Protection Act 2018 — pour les personnes concernées situées au Royaume-Uni",
  "EU General Data Protection Regulation": "Le règlement général sur la protection des données de l'UE (RGPD)",
  " (EU GDPR) — for data subjects in the European Economic Area":
    " — pour les personnes concernées situées dans l'Espace économique européen",
  "Other applicable data-protection laws of the jurisdiction in which a data subject is resident, where stricter":
    "Les autres lois de protection des données applicables dans la juridiction de résidence d'une personne concernée, lorsqu'elles sont plus strictes",
  "2. Information we collect": "2. Informations que nous collectons",
  "2.1 When you submit our contact form": "2.1 Lorsque vous soumettez notre formulaire de contact",
  "Name, email address, organisation": "Nom, adresse e-mail, organisation",
  "Platform of interest (optional)": "Plateforme d'intérêt (facultatif)",
  "The content of your message": "Le contenu de votre message",
  "2.2 When you join our Talent Pool": "2.2 Lorsque vous rejoignez notre vivier de talents",
  "The Talent Pool registration form on our website collects the following and submits it to our workflow-automation platform, ":
    "Le formulaire d'inscription au vivier de talents sur notre site collecte les informations suivantes et les transmet à notre plateforme d'automatisation des flux, ",
  ", which processes it on our behalf:": ", qui les traite pour notre compte :",
  "Full name and email address": "Nom complet et adresse e-mail",
  "Phone number (optional)": "Numéro de téléphone (facultatif)",
  "Country / location": "Pays / localisation",
  "LinkedIn profile URL (optional)": "URL du profil LinkedIn (facultatif)",
  "Primary platform / specialism, years of experience, availability, and engagement preference":
    "Plateforme / spécialité principale, années d'expérience, disponibilité et préférence d'engagement",
  "Certifications (required) and a cover note (optional)": "Certifications (obligatoires) et une lettre de motivation (facultative)",
  "Your CV (PDF or Word)": "Votre CV (PDF ou Word)",
  "Your consent to us storing these details for recruitment purposes, recorded with your submission":
    "Votre consentement à ce que nous conservions ces informations à des fins de recrutement, enregistré au moment de votre inscription",
  "2.3 When you book a demo": "2.3 Lorsque vous réservez une démo",
  "Before we show you our booking calendar, we ask for a few details so we know who we're meeting. Through the booking form we collect:":
    "Avant de vous présenter notre calendrier de réservation, nous vous demandons quelques informations afin de savoir avec qui nous échangerons. Le formulaire de réservation collecte :",
  "Your name and work email": "Votre nom et votre e-mail professionnel",
  "Company / organisation (optional)": "Entreprise / organisation (facultatif)",
  "These details are processed by n8n Cloud and stored in our SharePoint records. When you then choose a time, the booking itself is handled by ":
    "Ces informations sont traitées par n8n Cloud et conservées dans nos registres SharePoint. Lorsque vous choisissez un créneau, la réservation elle-même est gérée par ",
  ", which collects the meeting details you provide in order to schedule the call.":
    ", qui collecte les informations de rendez-vous que vous fournissez afin de programmer l'appel.",
  "2.4 When you visit our website": "2.4 Lorsque vous visitez notre site",
  "Standard analytics data via Google Analytics 4: anonymised IP, page views, device type, referral source, session duration":
    "Données analytiques standard via Google Analytics 4 : adresse IP anonymisée, pages vues, type d'appareil, source de référence, durée de session",
  "No advertising cookies, no cross-site tracking": "Aucun cookie publicitaire, aucun suivi intersites",
  "3. How we use your information": "3. Comment nous utilisons vos informations",
  "Lawful basis (NDPA 2023 / GDPR equivalents)": "Base légale (NDPA 2023 / équivalents RGPD)",
  "Respond to your enquiry": "Répondre à votre demande",
  "Legitimate interests — responding to direct enquiries": "Intérêts légitimes — réponse aux demandes directes",
  "Maintain our talent pool and match registrations to client opportunities":
    "Maintenir notre vivier de talents et rapprocher les inscriptions des opportunités clients",
  "Consent (granted via the registration form) and legitimate interests":
    "Consentement (accordé via le formulaire d'inscription) et intérêts légitimes",
  "Share your candidate profile with a specific potential employer": "Partager votre profil de candidat avec un employeur potentiel précis",
  "Explicit consent obtained per opportunity, before any sharing": "Consentement explicite obtenu pour chaque opportunité, avant tout partage",
  "Maintain operational and accounting records": "Tenir nos registres opérationnels et comptables",
  "Legitimate interests — business administration; legal obligation where applicable":
    "Intérêts légitimes — administration de l'activité ; obligation légale le cas échéant",
  "Improve the website and our services": "Améliorer le site et nos services",
  "Legitimate interests — analytics": "Intérêts légitimes — analytique",
  "4. How long we keep your data": "4. Combien de temps nous conservons vos données",
  "Data type": "Type de donnée",
  "Retention period": "Durée de conservation",
  "Contact form enquiries": "Demandes via le formulaire de contact",
  "24 months from last contact": "24 mois à compter du dernier contact",
  "Demo booking requests": "Demandes de réservation de démo",
  "24 months from request": "24 mois à compter de la demande",
  "Talent pool registrations (bio, CV)": "Inscriptions au vivier de talents (profil, CV)",
  "12 months from last contact": "12 mois à compter du dernier contact",
  "Website analytics (Google Analytics 4)": "Analytique du site (Google Analytics 4)",
  "14 months (Google default)": "14 mois (paramètre par défaut de Google)",
  "Records required by law (e.g. accounting)": "Registres exigés par la loi (comptabilité, par exemple)",
  "As long as legally required": "Aussi longtemps qu'exigé par la loi",
  "You may request earlier deletion at any time by emailing ": "Vous pouvez demander une suppression anticipée à tout moment en écrivant à ",
  "5. Who we share your data with": "5. Avec qui nous partageons vos données",
  "We share your information only with the parties below, and only to the extent necessary:":
    "Nous ne partageons vos informations qu'avec les parties ci-dessous, et dans la seule mesure nécessaire :",
  "Cloudflare": "Cloudflare",
  " — hosts our website and proxies all visitor traffic through its global edge network. Cloudflare processes IP addresses, request headers, and basic technical metadata for the purposes of content delivery, caching, and security (DDoS / bot protection). GDPR-compliant via Cloudflare's Data Processing Addendum and Standard Contractual Clauses (SCCs).":
    " — héberge notre site et relaie l'ensemble du trafic visiteur via son réseau mondial de périphérie. Cloudflare traite les adresses IP, les en-têtes de requête et des métadonnées techniques de base à des fins de diffusion de contenu, de mise en cache et de sécurité (protection DDoS / anti-bots). Conforme au RGPD via l'avenant de traitement des données de Cloudflare et les clauses contractuelles types (CCT).",
  "n8n Cloud (n8n GmbH)": "n8n Cloud (n8n GmbH)",
  " — our workflow-automation platform. It processes contact-form, demo-booking, and talent-pool submissions made on our website on our behalf, routing your data (including your CV) between our forms, our SharePoint records, and our outbound email provider. Based in the European Union (Germany), GDPR-compliant.":
    " — notre plateforme d'automatisation des flux. Elle traite pour notre compte les soumissions du formulaire de contact, de réservation de démo et du vivier de talents effectuées sur notre site, en acheminant vos données (y compris votre CV) entre nos formulaires, nos registres SharePoint et notre prestataire d'envoi d'e-mails. Basée dans l'Union européenne (Allemagne), conforme au RGPD.",
  "Microsoft": "Microsoft",
  " — we use Microsoft 365 email and SharePoint document storage to receive and store enquiries, talent pool registrations, and CVs in our private organisational tenant, and Microsoft Bookings to schedule the demo meetings you request.":
    " — nous utilisons la messagerie Microsoft 365 et le stockage documentaire SharePoint pour recevoir et conserver les demandes, les inscriptions au vivier de talents et les CV dans notre environnement organisationnel privé, ainsi que Microsoft Bookings pour planifier les démos que vous demandez.",
  "Zoho Corporation": "Zoho Corporation",
  " — sends our transactional confirmation emails — for example, the acknowledgement you receive after submitting the contact form or joining the talent pool. Zoho processes your name and email address solely for the purpose of delivering that message. GDPR-compliant.":
    " — envoie nos e-mails transactionnels de confirmation — par exemple, l'accusé de réception que vous recevez après avoir soumis le formulaire de contact ou rejoint le vivier de talents. Zoho traite votre nom et votre adresse e-mail uniquement pour délivrer ce message. Conforme au RGPD.",
  "Google Analytics 4": "Google Analytics 4",
  " — anonymised website analytics only. GDPR-compliant via Google's Data Processing Addendum.":
    " — analytique de site anonymisée uniquement. Conforme au RGPD via l'avenant de traitement des données de Google.",
  "Potential employers (talent pool only)": "Employeurs potentiels (vivier de talents uniquement)",
  " — we share your candidate profile with a specific employer ": " — nous partageons votre profil de candidat avec un employeur précis ",
  "only after obtaining your explicit consent for that specific opportunity": "uniquement après avoir obtenu votre consentement explicite pour cette opportunité précise",
  ". We never share talent pool data to a general database.": ". Nous ne partageons jamais les données du vivier de talents dans une base générale.",
  "We do not sell your data, ever.": "Nous ne vendons jamais vos données.",
  " We do not use your data for advertising or profile-based targeting.": " Nous n'utilisons pas vos données à des fins publicitaires ou de ciblage par profil.",
  "6. International transfers": "6. Transferts internationaux",
  "EquaCore is incorporated in Nigeria and our operations are global. Some of our service providers (Cloudflare, n8n, Microsoft, Zoho, Google) are based outside Nigeria, the United Kingdom, and the European Economic Area — principally in the United States and the European Union. Where data is transferred internationally, we rely on:":
    "EquaCore est immatriculée au Nigeria et ses activités sont mondiales. Certains de nos prestataires (Cloudflare, n8n, Microsoft, Zoho, Google) sont basés en dehors du Nigeria, du Royaume-Uni et de l'Espace économique européen — principalement aux États-Unis et dans l'Union européenne. Lorsque des données sont transférées à l'international, nous nous appuyons sur :",
  "For all data subjects:": "Pour toutes les personnes concernées :",
  " contractual safeguards (Standard Contractual Clauses) with each processor, in line with Sections 41–43 of the Nigeria Data Protection Act 2023":
    " des garanties contractuelles (clauses contractuelles types) avec chaque sous-traitant, conformément aux articles 41 à 43 de la loi nigériane de 2023 sur la protection des données",
  "For UK data subjects:": "Pour les personnes concernées au Royaume-Uni :",
  " the UK International Data Transfer Agreement or addendum to EU SCCs, as approved by the UK Information Commissioner's Office (ICO)":
    " l'accord international de transfert de données du Royaume-Uni ou l'avenant aux CCT de l'UE, tel qu'approuvé par l'Information Commissioner's Office (ICO) britannique",
  "For EU/EEA data subjects:": "Pour les personnes concernées dans l'UE/EEE :",
  " European Commission's Standard Contractual Clauses (SCCs)": " les clauses contractuelles types (CCT) de la Commission européenne",
  "Adequacy decisions": "Les décisions d'adéquation",
  " issued by the NDPC, the UK ICO, or the European Commission, where applicable":
    " rendues par la NDPC, l'ICO britannique ou la Commission européenne, le cas échéant",
  "We review these arrangements regularly to ensure your data continues to receive equivalent protection regardless of where it is processed.":
    "Nous révisons régulièrement ces dispositifs pour garantir que vos données continuent de bénéficier d'une protection équivalente, quel que soit le lieu où elles sont traitées.",
  "7. Your rights": "7. Vos droits",
  "Under the Nigeria Data Protection Act 2023, and where applicable the UK GDPR and EU GDPR, you have the following rights regarding your personal data:":
    "En vertu de la loi nigériane de 2023 sur la protection des données et, le cas échéant, du UK GDPR et du RGPD de l'UE, vous disposez des droits suivants sur vos données personnelles :",
  "Access": "Accès",
  " — request a copy of the personal data we hold about you": " — demander une copie des données personnelles que nous détenons à votre sujet",
  "Rectification": "Rectification",
  " — correct inaccurate or incomplete data": " — corriger des données inexactes ou incomplètes",
  "Erasure": "Effacement",
  " — request deletion of your data (\"the right to be forgotten\")": " — demander la suppression de vos données (« droit à l'oubli »)",
  "Restriction": "Limitation",
  " — ask us to limit how we process your data": " — nous demander de limiter le traitement de vos données",
  "Objection": "Opposition",
  " — object to processing based on legitimate interests": " — vous opposer à un traitement fondé sur des intérêts légitimes",
  "Withdraw consent": "Retrait du consentement",
  " — at any time, where consent is the lawful basis (e.g. talent pool)": " — à tout moment, lorsque le consentement constitue la base légale (par exemple pour le vivier de talents)",
  "Portability": "Portabilité",
  " — receive your data in a structured, machine-readable format": " — recevoir vos données dans un format structuré et lisible par machine",
  "Lodge a complaint": "Déposer une plainte",
  " — with the Nigeria Data Protection Commission (": " — auprès de la Commission nigériane de protection des données (",
  "); UK data subjects may complain to the Information Commissioner's Office (":
    ") ; les personnes concernées au Royaume-Uni peuvent saisir l'Information Commissioner's Office (",
  "); EU/EEA data subjects may complain to their national supervisory authority":
    ") ; les personnes concernées dans l'UE/EEE peuvent saisir leur autorité de contrôle nationale",
  "To exercise any of these rights, email ": "Pour exercer l'un de ces droits, écrivez à ",
  ". We will respond within 30 days. There is no charge unless your request is manifestly unfounded or excessive.":
    ". Nous répondrons sous 30 jours. Aucun frais n'est appliqué, sauf demande manifestement infondée ou excessive.",
  "8. Cookies": "8. Cookies",
  "We use only essential cookies and Google Analytics. Specifically:": "Nous n'utilisons que des cookies essentiels et Google Analytics. Plus précisément :",
  "Essential cookies": "Cookies essentiels",
  " — required for the website to function (none are set unless strictly necessary).": " — nécessaires au fonctionnement du site (aucun n'est déposé sauf strict besoin).",
  "Analytics cookies": "Cookies analytiques",
  " — Google Analytics 4 (": " — Google Analytics 4 (",
  ") for anonymised usage statistics. IP anonymisation is enabled.": ") pour des statistiques d'usage anonymisées. L'anonymisation de l'IP est activée.",
  "We do not use advertising cookies, social-media tracking, or cross-site profiling. You can disable cookies in your browser without affecting site functionality.":
    "Nous n'utilisons ni cookies publicitaires, ni suivi via les réseaux sociaux, ni profilage intersites. Vous pouvez désactiver les cookies dans votre navigateur sans affecter le fonctionnement du site.",
  "9. Security": "9. Sécurité",
  "We protect your data using:": "Nous protégeons vos données grâce à :",
  "TLS / HTTPS encryption for all data in transit": "Un chiffrement TLS / HTTPS pour toutes les données en transit",
  "Microsoft 365 enterprise security for stored data (encryption at rest, access logging)":
    "La sécurité d'entreprise Microsoft 365 pour les données stockées (chiffrement au repos, journalisation des accès)",
  "Role-based access controls limiting which EquaCore personnel can view your data":
    "Des contrôles d'accès basés sur les rôles, limitant les membres du personnel EquaCore pouvant consulter vos données",
  "Regular review of our security and data-handling practices": "Une revue régulière de nos pratiques de sécurité et de traitement des données",
  "No system is perfectly secure. If you become aware of a security incident affecting your data, please email ":
    "Aucun système n'est parfaitement sûr. Si vous avez connaissance d'un incident de sécurité touchant vos données, écrivez immédiatement à ",
  " immediately. In the event of a personal data breach, we will notify the Nigeria Data Protection Commission (and, where applicable, the UK ICO or relevant EU supervisory authority) and affected individuals within 72 hours, as required by the Nigeria Data Protection Act 2023 and the UK/EU GDPR.":
    ". En cas de violation de données personnelles, nous informerons la Commission nigériane de protection des données (et, le cas échéant, l'ICO britannique ou l'autorité de contrôle européenne compétente) ainsi que les personnes concernées sous 72 heures, conformément à la loi nigériane de 2023 sur la protection des données et au UK/EU GDPR.",
  "10. Children's data": "10. Données des mineurs",
  "This website and our services are not directed to individuals under 16. We do not knowingly collect data from anyone under 16. If you believe we have, please contact us and we will delete it.":
    "Ce site et nos services ne s'adressent pas aux personnes de moins de 16 ans. Nous ne collectons sciemment aucune donnée auprès de personnes de moins de 16 ans. Si vous pensez que cela s'est produit, contactez-nous et nous supprimerons ces données.",
  "11. Changes to this policy": "11. Modifications de la présente politique",
  "We may update this Privacy Policy as our practices evolve or as required by law. The \"last updated\" date at the top of the page reflects the most recent change. Material changes affecting how we use existing data will be communicated by email where we have your contact details.":
    "Nous pouvons mettre à jour cette politique de confidentialité à mesure que nos pratiques évoluent ou que la loi l'exige. La date de « dernière mise à jour » en haut de la page reflète la modification la plus récente. Les changements substantiels affectant l'utilisation des données existantes seront communiqués par e-mail lorsque nous disposons de vos coordonnées.",
  "12. Contact us": "12. Nous contacter",
  "For privacy questions, data subject requests, or complaints:": "Pour toute question relative à la confidentialité, toute demande ou réclamation :",
  "Email: ": "E-mail : ",
  "Subject line for data requests: ": "Objet pour les demandes relatives aux données : ",
  "Privacy Request — [Your Name]": "Demande de confidentialité — [Votre nom]",
  "If you are not satisfied with our response, you have the right to complain to your supervisory authority:":
    "Si notre réponse ne vous satisfait pas, vous avez le droit de saisir votre autorité de contrôle :",
  "Nigeria (primary):": "Nigeria (principale) :",
  " Nigeria Data Protection Commission — ": " Commission nigériane de protection des données — ",
  "United Kingdom:": "Royaume-Uni :",
  " Information Commissioner's Office — ": " Information Commissioner's Office — ",
  " · phone 0303 123 1113": " · téléphone 0303 123 1113",
  "European Union / EEA:": "Union européenne / EEE :",
  " your national data protection authority (find yours at ": " votre autorité nationale de protection des données (à retrouver sur ",

  // ---- Enquiry thanks / thank-you pages ----
  "Message received — thank you": "Message reçu — merci",
  "We'll be in touch shortly": "Nous vous recontactons très prochainement",
  "Here's what happens next.": "Voici ce qui se passe ensuite.",
  "Step 1 — We review your message": "Étape 1 — Nous examinons votre message",
  "Our team reads every enquiry and makes sure it reaches the right person within one business day.":
    "Notre équipe lit chaque demande et veille à ce qu'elle parvienne à la bonne personne en un jour ouvré.",
  "Step 2 — We reach out directly": "Étape 2 — Nous vous contactons directement",
  "Expect a reply to the email address you provided. If your enquiry needs a call, we'll suggest a time that works for you.":
    "Attendez-vous à une réponse à l'adresse e-mail que vous avez fournie. Si votre demande nécessite un appel, nous vous proposerons un créneau qui vous convient.",
  "Step 3 — We get to work": "Étape 3 — Nous nous mettons au travail",
  "Once we understand your needs, we'll outline the right engagement model and next steps — no pressure, no jargon.":
    "Une fois vos besoins compris, nous vous présenterons le modèle d'engagement adapté et les prochaines étapes — sans pression, sans jargon.",
  "Can't wait? Email us directly at ": "Vous ne pouvez pas attendre ? Écrivez-nous directement à ",
  "Back to Home": "Retour à l'accueil",
  "Explore our services →": "Découvrir nos services →",
  "Thank you — we've got your details": "Merci — nous avons bien reçu vos informations",
  "You're in the EquaCore Talent Pool": "Vous faites désormais partie du vivier de talents EquaCore",
  "Here's what happens next from our side.": "Voici ce qui se passe ensuite de notre côté.",
  "Step 1 — Profile review": "Étape 1 — Examen du profil",
  "Step 2 — Opportunity matching": "Étape 2 — Rapprochement des opportunités",
  "We match your profile against current and pipeline roles across our client base.":
    "Nous comparons votre profil aux postes actuels et à venir au sein de notre clientèle.",
  "Step 3 — Direct outreach": "Étape 3 — Prise de contact directe",
  "Questions in the meantime? Email ": "Des questions d'ici là ? Écrivez à ",

  // ---- Booking modal ----
  "30 minutes with a practitioner, not a sales deck. A few details and we'll take you straight to the calendar.":
    "30 minutes avec un praticien, pas une présentation commerciale. Quelques informations et nous vous emmenons directement au calendrier.",
  "Work Email *": "E-mail professionnel *",
  "Continue to booking": "Continuer vers la réservation",
  "Booking page didn't open? Click here": "La page de réservation ne s'est pas ouverte ? Cliquez ici",

  // ---- Footer ----
  "Digital operations consulting and implementation. Bridging operational strategy with hands-on platform delivery.":
    "Conseil et implémentation en opérations numériques. Faire le lien entre stratégie opérationnelle et livraison concrète de plateformes.",
  "Quick Links": "Liens rapides",
  "All rights reserved.": "Tous droits réservés.",
  "Digital Operations. Delivered Right.": "Opérations numériques. Bien exécutées.",
  "ServiceNow® is a registered trademark of ServiceNow, Inc. HaloITSM™, HaloPSA™, and HaloCRM™ are trademarks of Halo Service Solutions Ltd. EquaCore Digital is an authorised Halo Technology Alliance Partner. EquaCore Digital is not affiliated with, endorsed by, or sponsored by ServiceNow, Inc. References to these platforms describe the technologies we implement and support on behalf of clients.":
    "ServiceNow® est une marque déposée de ServiceNow, Inc. HaloITSM™, HaloPSA™ et HaloCRM™ sont des marques de Halo Service Solutions Ltd. EquaCore Digital est un partenaire agréé du Halo Technology Alliance. EquaCore Digital n'est affiliée à ServiceNow, Inc., ni soutenue ou parrainée par cette société. Les références à ces plateformes décrivent les technologies que nous implémentons et prenons en charge pour le compte de nos clients.",
  "+234 815 698 8358 (Sales)": "+234 815 698 8358 (Ventes)",
  "+234 808 660 2573 (Direct)": "+234 808 660 2573 (Ligne directe)",
  "Get in Touch": "Nous contacter",
  "EquaCore Digital Ltd. All rights reserved.": "EquaCore Digital Ltd. Tous droits réservés.",

  // ---- Gap fixes (found during browser verification) ----
  "Purpose": "Finalité",
  "Select a platform (optional)": "Choisissez une plateforme (facultatif)",
  "Select…": "Choisissez…",
  "Website (leave blank)": "Site web (laisser vide)",
  "EquaCore Digital Ltd (registered in Nigeria)  ·": "EquaCore Digital Ltd (immatriculée au Nigeria)  ·",
  // talent-pool step 3 — sentence split by an inline <strong>before</strong>
  "If a relevant role surfaces, we'll reach out by email": "Si un poste pertinent se présente, nous vous contacterons par e-mail",
  "before": "avant",
  "sharing your profile with any employer.": "de partager votre profil avec un employeur, quel qu'il soit.",

  // ---- SEO titles ----
  "EquaCore Digital — Digital Operations. Delivered Right.": "EquaCore Digital — Opérations numériques. Bien exécutées.",
  "Halo Services (HaloITSM, HaloPSA, HaloCRM) — EquaCore Digital": "Services Halo (HaloITSM, HaloPSA, HaloCRM) — EquaCore Digital",
  "Freshworks Services & Implementation — EquaCore Digital": "Services et implémentation Freshworks — EquaCore Digital",
  "Responsible Claude Adoption — EquaCore Digital": "Adoption responsable de Claude — EquaCore Digital",
  "OpenAI Adoption & Integration — EquaCore Digital": "Adoption et intégration d'OpenAI — EquaCore Digital",
  "Talent Augmentation — EquaCore Digital": "Renfort de talents — EquaCore Digital",
  "Join Our Talent Pool — EquaCore Digital": "Rejoindre notre vivier de talents — EquaCore Digital",
  "Engagement Models — EquaCore Digital": "Modèles d'engagement — EquaCore Digital",
  "About — EquaCore Digital": "À propos — EquaCore Digital",
  "Privacy Policy — EquaCore Digital": "Politique de confidentialité — EquaCore Digital",
  "Thank You — EquaCore Digital": "Merci — EquaCore Digital",
  "Message Received — EquaCore Digital": "Message reçu — EquaCore Digital",

  // ---- SEO descriptions ----
  "EquaCore Digital improves service delivery through platform implementation, independent advisory, managed support and specialist talent.":
    "EquaCore Digital améliore la prestation de services grâce à l'implémentation de plateformes, au conseil indépendant, au support géré et aux talents spécialisés.",
  "EquaCore Digital delivers platform implementation and improvement across Halo and Freshworks solutions, independent ServiceNow services, specialist talent and responsible AI delivery.":
    "EquaCore Digital assure l'implémentation et l'amélioration de plateformes couvrant les solutions Halo et Freshworks, des services ServiceNow indépendants, des talents spécialisés et une livraison responsable de solutions d'IA.",
  "EquaCore Digital delivers Freshworks implementation and optimisation, from process mapping and configuration to integrations, migration and enablement.":
    "EquaCore Digital assure l'implémentation et l'optimisation de Freshworks, de la cartographie des processus et de la configuration aux intégrations, à la migration et à l'accompagnement.",
  "EquaCore Digital helps organisations adopt Claude responsibly through use-case discovery, integration design, human oversight, rollout and evaluation.":
    "EquaCore Digital aide les organisations à adopter Claude de manière responsable grâce à la découverte des cas d'usage, à la conception des intégrations, à la supervision humaine, au déploiement et à l'évaluation.",
  "EquaCore Digital helps organisations adopt and integrate OpenAI through use-case discovery, connected knowledge and tools, human approval, rollout and ongoing improvement.":
    "EquaCore Digital aide les organisations à adopter et intégrer OpenAI grâce à la découverte des cas d'usage, aux connaissances et outils connectés, à la validation humaine, au déploiement et à l'amélioration continue.",
  "Join the EquaCore talent pool. ServiceNow and Halo professionals in Nigeria can register to be matched with enterprise placements across Nigeria, the UK, and Europe — permanent, contract, or embedded.":
    "Rejoignez le vivier de talents EquaCore. Les professionnels ServiceNow et Halo au Nigeria peuvent s'inscrire pour être rapprochés de placements en entreprise au Nigeria, au Royaume-Uni et en Europe — permanent, contrat ou intégré.",
  "EquaCore Digital privacy policy — how we collect, use, and protect your data.":
    "Politique de confidentialité d'EquaCore Digital — comment nous collectons, utilisons et protégeons vos données.",

  // ---- Transient JS strings ----
  "Sending...": "Envoi en cours...",
  "Error — please try again": "Erreur — veuillez réessayer",
  "Please complete the security check.": "Veuillez terminer la vérification de sécurité.",
  "Please enter a valid email address from a real domain.": "Veuillez saisir une adresse e-mail valide provenant d'un domaine réel.",
  "Please complete the security check and try again.": "Veuillez terminer la vérification de sécurité et réessayer.",
  "Checking...": "Vérification en cours...",
  "We could not verify your request. Please try again, or use the contact form instead.":
    "Nous n'avons pas pu vérifier votre demande. Veuillez réessayer, ou utiliser plutôt le formulaire de contact.",
  "Connection error — please try again.": "Erreur de connexion — veuillez réessayer.",
  "Your CV is larger than 8 MB. Please upload a smaller file.": "Votre CV dépasse 8 Mo. Veuillez charger un fichier plus léger.",
  "Submitting...": "Envoi en cours...",
  "We could not verify your application. Please complete the security check and try again.":
    "Nous n'avons pas pu vérifier votre candidature. Veuillez terminer la vérification de sécurité et réessayer.",
  // ServiceNow: connected operation illustration.
  "IT requests": "Demandes IT",
  "Infra alerts": "Alertes infra",
  "Asset data": "Données d’actifs",
  "HR cases": "Dossiers RH",
  "Customers": "Clients",
  "One platform": "Une plateforme",
  "Visible": "Visible",
  "Owned": "Pris en charge",
  "Measured": "Mesuré",
  "Visible to leadership": "Visible pour la direction",
  "Services, assets, risk, SLAs": "Services, actifs, risques, SLA",
  "From fragmented work to one connected operation.": "D’un travail fragmenté à une organisation connectée.",
  "Fragmented work connects through one platform.": "Le travail fragmenté est relié par une plateforme unique.",
  "IT requests, infrastructure alerts, asset data, HR cases and customers connect to one platform. Three rows progress from visible to owned to measured work, giving leadership a view of services, assets, risk and SLAs.": "Les demandes IT, les alertes d’infrastructure, les données d’actifs, les dossiers RH et les clients sont reliés à une plateforme unique. Trois lignes passent de la visibilité à la prise en charge, puis à la mesure du travail, donnant à la direction une vue des services, des actifs, des risques et des SLA."
};
const FR_ATTR = {
  "EquaCore Digital - Home": "EquaCore Digital - Accueil",
  "Main navigation": "Navigation principale",
  "Core offerings at a glance": "Aperçu des offres principales",
  "Processes, platforms and people converge in EquaCore's digital improvement delivery model": "Les processus, les plateformes et les personnes convergent dans le modèle d'amélioration numérique d'EquaCore",
  "Halo and Freshworks solutions feed an improvement journey from discovery and design through implementation and continuous optimisation.": "Les solutions Halo et Freshworks alimentent un parcours d'amélioration allant de la découverte et de la conception jusqu'à l'implémentation et à l'optimisation continue.",
  "Service requests move through an independent ServiceNow operations cycle of assessment, operation, advice and improvement, with resolved work feeding future improvement.": "Les demandes de service suivent un cycle d'exploitation ServiceNow indépendant comprenant l'évaluation, l'exploitation, le conseil et l'amélioration, les travaux résolus alimentant les améliorations futures.",
  "Work, knowledge and people move through a five-stage Claude adoption journey of discovery, prioritisation, connection, governance and improvement, with human review and evaluation built into the cycle.": "Le travail, les connaissances et les personnes suivent un parcours d'adoption de Claude en cinq étapes — découverte, priorisation, connexion, gouvernance et amélioration — avec validation humaine et évaluation intégrées au cycle.",
  "People, approved knowledge and systems move through ChatGPT workspace and API tool rails into an owned operational workflow, with human approval before assistance or action and learning feeding continuous improvement.": "Les personnes, les connaissances approuvées et les systèmes passent par les voies de l'espace de travail ChatGPT et des outils API vers un flux opérationnel maîtrisé, avec validation humaine avant l'assistance ou l'action et des enseignements qui alimentent l'amélioration continue.",
  "Toggle navigation menu": "Afficher/masquer le menu de navigation",
  "Scroll to top": "Remonter en haut de la page",
  "Chat with EquaCore on WhatsApp": "Discuter avec EquaCore sur WhatsApp",
  "Close": "Fermer",
  "EquaCore Digital on LinkedIn": "EquaCore Digital sur LinkedIn",
  "EquaCore Digital on Instagram": "EquaCore Digital sur Instagram",
  "EquaCore Digital on Google Business": "EquaCore Digital sur Google Business",
  "Your full name": "Votre nom complet",
  "you@company.com": "vous@entreprise.com",
  "Your organisation": "Votre organisation",
  "Tell us about your project or requirements...": "Parlez-nous de votre projet ou de vos besoins...",
  "you@example.com": "vous@exemple.com",
  "Where are you based?": "Où êtes-vous basé(e) ?",
  "e.g. ServiceNow CSA, CAD; HaloITSM Admin": "ex. ServiceNow CSA, CAD ; administrateur HaloITSM",
  "Anything you'd like us to know (optional)": "Tout ce que vous souhaitez nous indiquer (facultatif)",
  "Select a platform (optional)": "Choisissez une plateforme (facultatif)",
  "Select…": "Choisissez…"
};
// ===== END TRANSLATION DICTIONARY =====

// Normalize typographic variants so keys written with straight quotes / normal
// spaces still match DOM text that uses &rsquo; (’), &nbsp; ( ), or smart quotes.
// Applied to both dictionary keys (at load) and looked-up text (at match time).
function norm(s) {
  return s
    .replace(/ /g, ' ')          // nbsp → space
    .replace(/[‘’]/g, "'")  // ‘ ’ → '
    .replace(/[“”]/g, '"')  // “ ” → "
    .trim();
}
// Normalized lookup tables built once from the dictionaries above.
const FR_NORM = {}, FR_ATTR_NORM = {};
for (const k in FR) FR_NORM[norm(k)] = FR[k];
for (const k in FR_ATTR) FR_ATTR_NORM[norm(k)] = FR_ATTR[k];

// Return the French string when the page is in French, else the input unchanged.
// Used by scripts.js for transient runtime strings (button states, error messages).
window.t = function (s) {
  if (document.documentElement.lang !== 'fr') return s;
  const n = norm(s);
  return FR_NORM[n] || FR_ATTR_NORM[n] || s;
};

// Walk visible text nodes under <body>, skipping non-content subtrees, and swap any
// trimmed value found in FR. Preserves surrounding whitespace. Also sweeps a few
// human-readable attributes against FR_ATTR, and translates the document title.
function applyFrench() {
  const SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CANVAS: 1, svg: 1 };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      for (let p = node.parentNode; p && p !== document.body; p = p.parentNode) {
        // SVG elements report a lowercase-namespaced nodeName; guard both.
        if (SKIP[p.nodeName] || p.nodeName.toLowerCase() === 'svg') return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const raw = node.nodeValue;
    const fr = FR_NORM[norm(raw)];
    if (fr !== undefined) { // '' is a valid value (e.g. folding an article into the next fragment)
      const lead = raw.match(/^\s*/)[0];
      const trail = raw.match(/\s*$/)[0];
      node.nodeValue = lead + fr + trail;
    }
  });
  // Translate the curated process graphics with meaningful labels; other SVGs are icons.
  document.querySelectorAll('.an-process-svg text,.an-process-svg title,.an-process-svg desc,.oa-process-svg text,.oa-process-svg title,.oa-process-svg desc,.delivery-scene-svg text,.delivery-scene-svg title,.delivery-scene-svg desc').forEach(el => {
    const fr = FR_NORM[norm(el.textContent)];
    if (fr !== undefined) el.textContent = fr;
  });
  document.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(el => {
    ['placeholder', 'aria-label', 'alt', 'title'].forEach(attr => {
      const v = el.getAttribute(attr);
      if (v && FR_ATTR_NORM[norm(v)]) el.setAttribute(attr, FR_ATTR_NORM[norm(v)]);
    });
  });
  document.documentElement.lang = 'fr';
  if (window.deliverySceneSync) window.deliverySceneSync();
  const active = document.querySelector('.pg.act');
  if (active && typeof setMeta === 'function') setMeta(active.id.replace(/^pg-/, ''));
  if (FR_NORM[norm(document.title)]) document.title = FR_NORM[norm(document.title)];
  const btn = document.getElementById('langt');
  if (btn) { btn.textContent = 'EN'; btn.setAttribute('aria-label', "EN — Passer à l'anglais"); }
}

// Toggle entry point (wired to the nav button in index.html). A manual choice is
// always persisted — including an explicit 'en' — so it wins over auto-detection.
function setLang(lang) {
  if (lang === 'fr') {
    localStorage.setItem('lang', 'fr');
    applyFrench();
  } else {
    localStorage.setItem('lang', 'en');
    location.reload(); // restore shipped English cleanly
  }
}
window.setLang = setLang;

// True when the visitor's browser prefers French (fr, fr-FR, fr-CA, …).
function prefersFrench() {
  const langs = navigator.languages && navigator.languages.length
    ? navigator.languages : [navigator.language || ''];
  return langs.some(l => /^fr\b/i.test(l));
}

// SPA navigation re-renders the title (and could surface a freshly-shown page).
// All .pg sections are translated in one pass and stay French while hidden, so only
// the title needs re-translating after a route change.
if (typeof window.showPage === 'function') {
  const orig = window.showPage;
  window.showPage = function (id) {
    orig(id);
    if (document.documentElement.lang === 'fr' && FR_NORM[norm(document.title)]) {
      document.title = FR_NORM[norm(document.title)];
    }
  };
}

// Decide the language on load (after scripts.js has run its initial route):
//  - an explicit stored choice (from the toggle) always wins;
//  - otherwise auto-switch to French when the browser prefers it.
window.addEventListener('DOMContentLoaded', function () {
  const stored = localStorage.getItem('lang');
  if (stored === 'en') return;                 // user explicitly chose English
  if (stored === 'fr' || prefersFrench()) applyFrench();
});
