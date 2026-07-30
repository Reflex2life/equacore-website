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
  "Book a demo": "Réserver une démo",

  // ---- Home hero ----
  "Enterprise Platforms": "Plateformes d'entreprise",
  "Halo & ServiceNow — ": "Halo et ServiceNow — ",
  "delivered with discipline": "livré avec rigueur",
  "Full-lifecycle Halo platform implementations, plus independent ServiceNow advisory and managed operations — run with the governance of people who've done this for 30 years.":
    "Des implémentations Halo de bout en bout, complétées par un conseil ServiceNow indépendant et une exploitation gérée — pilotés avec la rigueur de personnes qui font cela depuis 30 ans.",
  "Book a 30-minute demo": "Réserver une démo de 30 minutes",
  "See how we deliver": "Découvrir notre méthode",
  "Years Combined Experience": "Années d'expérience cumulée",
  "Platform Specialisations": "Spécialisations plateformes",
  "Global Regions": "Régions couvertes",
  "Full Halo Technology Alliance Partner": "Partenaire à part entière du Halo Technology Alliance",
  "ServiceNow® Ecosystem Practice — Independent": "Pratique de l'écosystème ServiceNow® — indépendante",

  // ---- Core Offerings ----
  "Core Offerings": "Nos offres principales",
  "Enterprise platforms, delivered right": "Des plateformes d'entreprise, livrées comme il se doit",
  "Three ways we engage. All of them end with your team owning the platform.":
    "Trois façons de collaborer. Toutes se terminent avec une plateforme que votre équipe maîtrise pleinement.",
  "Full Halo partner — delivering HaloITSM, HaloPSA, and HaloCRM across full-lifecycle implementations, migrations, process alignment, and managed support.":
    "Partenaire Halo à part entière — nous livrons HaloITSM, HaloPSA et HaloCRM, de l'implémentation de bout en bout aux migrations, à l'alignement des processus et au support géré.",
  "Explore Halo Services →": "Découvrir les services Halo →",
  "HaloITSM — IT & Enterprise Service Management": "HaloITSM — gestion des services IT et d'entreprise",
  "HaloPSA — MSP & Professional Services Automation": "HaloPSA — automatisation pour MSP et services professionnels",
  "HaloCRM — Omnichannel Sales & Customer Service": "HaloCRM — ventes et service client omnicanal",
  "Legacy tool migration & process alignment": "Migration d'outils existants et alignement des processus",
  "User onboarding & post-go-live managed support": "Prise en main utilisateurs et support géré après mise en service",
  "Pre-vetted ServiceNow talent for placement and embedded teams, day-2 managed operations, and independent platform advisory — supporting organisations using the ServiceNow® platform.":
    "Des talents ServiceNow présélectionnés pour le placement et les équipes intégrées, une exploitation gérée au quotidien et un conseil plateforme indépendant — au service des organisations qui utilisent la plateforme ServiceNow®.",
  "Explore ServiceNow →": "Découvrir ServiceNow →",
  "Talent placement & embedded teams": "Placement de talents et équipes intégrées",
  "Managed services & day-2 operations": "Services gérés et exploitation au quotidien",
  "Independent advisory & health checks": "Conseil indépendant et bilans de santé plateforme",
  "Process design aligned to ITIL": "Conception de processus alignée sur ITIL",
  "We deploy pre-vetted Nigerian ServiceNow professionals globally — with mentorship, enterprise readiness, and flexible engagement structures.":
    "Nous déployons dans le monde entier des professionnels ServiceNow nigérians présélectionnés — avec mentorat, préparation aux exigences de l'entreprise et des formats d'engagement flexibles.",
  "Explore Talent →": "Découvrir nos talents →",
  "Pre-vetted ServiceNow professionals": "Professionnels ServiceNow présélectionnés",
  "Mentorship & upskilling programs": "Programmes de mentorat et de montée en compétences",
  "Enterprise delivery readiness": "Préparation à la livraison en entreprise",
  "Flexible embedded consulting": "Conseil intégré flexible",

  // ---- Approach ----
  "Our Approach": "Notre méthode",
  "From discovery to sustainable delivery": "De la découverte à une livraison durable",
  "We follow a disciplined methodology that ensures every engagement produces practical outcomes and lasting value.":
    "Nous suivons une méthodologie rigoureuse qui garantit que chaque mission produit des résultats concrets et une valeur durable.",
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
  "Delivery Governance": "Gouvernance de livraison",
  "Structured project governance ensuring accountability at every stage.":
    "Une gouvernance de projet structurée qui garantit la responsabilisation à chaque étape.",
  "We build your internal capability, not long-term dependency.":
    "Nous renforçons vos compétences internes, sans créer de dépendance à long terme.",
  "Outcomes Focused": "Axés sur les résultats",
  "Every engagement is measured against tangible business improvements.":
    "Chaque mission est évaluée à l'aune d'améliorations concrètes pour l'activité.",
  "Technology Agnostic": "Neutres vis-à-vis de la technologie",
  "We recommend the right tools, not just the ones we sell.":
    "Nous recommandons les outils adaptés, pas seulement ceux que nous vendons.",

  // ---- Talent & Community (home) ----
  "Talent & Community": "Talents et communauté",
  "Quality talent, global delivery": "Des talents de qualité, une livraison mondiale",
  "Pre-vetted ServiceNow and Halo professionals deployed globally — with mentorship, enterprise readiness, and flexible engagement structures.":
    "Des professionnels ServiceNow et Halo présélectionnés, déployés dans le monde entier — avec mentorat, préparation aux exigences de l'entreprise et des formats d'engagement flexibles.",
  "Pre-vetted Talent": "Talents présélectionnés",
  "Rigorously assessed ServiceNow and Halo professionals deployed into enterprise environments.":
    "Des professionnels ServiceNow et Halo rigoureusement évalués, déployés dans des environnements d'entreprise.",
  "Mentorship & Readiness": "Mentorat et préparation",
  "Structured development ensuring consultants are enterprise-ready from day one.":
    "Un développement structuré qui garantit que les consultants sont opérationnels en entreprise dès le premier jour.",
  "Community Ecosystem": "Écosystème communautaire",
  "A growing network of ServiceNow and Halo technologists, mentors, and delivery leaders.":
    "Un réseau grandissant de spécialistes techniques ServiceNow et Halo, de mentors et de responsables de livraison.",
  "Global Delivery": "Livraison mondiale",
  "Distributed teams delivering ServiceNow and Halo implementations with governance and measurable outcomes.":
    "Des équipes réparties qui livrent des implémentations ServiceNow et Halo avec gouvernance et résultats mesurables.",

  // ---- Topical density paragraph ----
  "EquaCore Digital is a ServiceNow consulting and full Halo platform partner headquartered in Nigeria and operating globally. We provide ServiceNow talent augmentation — placing pre-vetted administrators, developers, and architects with enterprise clients — alongside day-2 managed services and independent advisory. As a full Halo Technology Alliance Partner, we are authorised to deliver end-to-end implementations of HaloITSM (IT and Enterprise Service Management), HaloPSA (Professional Services Automation for MSPs), and HaloCRM (omnichannel CRM). Our delivery model combines African technology talent with structured governance frameworks, enabling organisations across the UK, Europe, and West Africa to modernise their service operations with confidence.":
    "EquaCore Digital est un cabinet de conseil ServiceNow et partenaire Halo à part entière, basé au Nigeria et actif dans le monde entier. Nous proposons du renfort de talents ServiceNow — en plaçant des administrateurs, développeurs et architectes présélectionnés auprès de clients grands comptes —, ainsi que des services gérés au quotidien et un conseil indépendant. En tant que partenaire à part entière du Halo Technology Alliance, nous sommes habilités à livrer des implémentations complètes de HaloITSM (gestion des services IT et d'entreprise), HaloPSA (automatisation des services professionnels pour MSP) et HaloCRM (CRM omnicanal). Notre modèle de livraison associe des talents technologiques africains à des cadres de gouvernance structurés, permettant aux organisations du Royaume-Uni, d'Europe et d'Afrique de l'Ouest de moderniser leurs opérations de service en toute confiance.",

  // ---- FAQ ----
  "FAQ": "FAQ",
  "Frequently Asked Questions": "Questions fréquentes",
  "What does EquaCore Digital do?": "Que fait EquaCore Digital ?",
  "EquaCore Digital is a technology services firm specialising in ServiceNow and the full Halo platform. We provide talent augmentation (placing pre-vetted ServiceNow professionals with global enterprises), managed services (day-2 platform operations), and independent advisory — plus full implementations of HaloITSM, HaloPSA, and HaloCRM as a full Halo Technology Alliance Partner.":
    "EquaCore Digital est un cabinet de services technologiques spécialisé dans ServiceNow et l'ensemble de la plateforme Halo. Nous proposons du renfort de talents (placement de professionnels ServiceNow présélectionnés auprès d'entreprises internationales), des services gérés (exploitation de plateforme au quotidien) et du conseil indépendant — ainsi que des implémentations complètes de HaloITSM, HaloPSA et HaloCRM en tant que partenaire à part entière du Halo Technology Alliance.",
  "What ServiceNow and Halo roles can EquaCore place?": "Quels profils ServiceNow et Halo EquaCore peut-il placer ?",
  "We place administrators and system engineers, developers and integration engineers, solution architects, business analysts, CMDB/Discovery/SAM specialists, and process consultants across ServiceNow and HaloITSM, HaloPSA, and HaloCRM, including certified Halo administrators, HaloITSM implementation specialists, and Halo Service Desk engineers. All candidates are technically assessed and enterprise-ready before placement.": "Nous plaçons des administrateurs et ingénieurs système, des développeurs et ingénieurs d'intégration, des architectes de solutions, des analystes métier, des spécialistes CMDB/Discovery/SAM et des consultants processus sur ServiceNow ainsi que sur HaloITSM, HaloPSA et HaloCRM, y compris des administrateurs Halo certifiés, des spécialistes de l'implémentation HaloITSM et des ingénieurs Halo Service Desk. Tous les candidats sont évalués techniquement et prêts pour l'entreprise avant placement.",
  "Is EquaCore an official Halo partner?": "EquaCore est-il un partenaire Halo officiel ?",
  "Yes. EquaCore Digital is a full Halo Technology Alliance Partner, authorised to implement and support all three Halo products: HaloITSM (IT and Enterprise Service Management), HaloPSA (Professional Services Automation for MSPs), and HaloCRM (omnichannel CRM for customer-facing teams). We deliver platform implementations, legacy migrations, process alignment, user onboarding, and post-go-live managed support across the complete Halo product suite.":
    "Oui. EquaCore Digital est partenaire à part entière du Halo Technology Alliance, habilité à implémenter et à assurer le support des trois produits Halo : HaloITSM (gestion des services IT et d'entreprise), HaloPSA (automatisation des services professionnels pour MSP) et HaloCRM (CRM omnicanal pour les équipes en contact avec la clientèle). Nous assurons les implémentations de plateforme, les migrations d'outils existants, l'alignement des processus, la prise en main utilisateurs et le support géré après mise en service sur l'ensemble de la gamme Halo.",
  "Do you work with clients outside Nigeria?": "Travaillez-vous avec des clients en dehors du Nigeria ?",
  "Yes. While our talent base is primarily Nigerian, our delivery is global. We work with clients in the UK, Europe, and across West Africa, providing distributed teams with structured governance and measurable outcomes.":
    "Oui. Si notre vivier de talents est principalement nigérian, notre livraison est mondiale. Nous travaillons avec des clients au Royaume-Uni, en Europe et en Afrique de l'Ouest, en proposant des équipes réparties avec une gouvernance structurée et des résultats mesurables.",
  "What is the difference between HaloITSM, HaloPSA, and HaloCRM?": "Quelle est la différence entre HaloITSM, HaloPSA et HaloCRM ?",
  " is ITIL-aligned IT and Enterprise Service Management — ideal for organisations managing internal IT services, facilities, HR, and more.":
    " est une solution de gestion des services IT et d'entreprise alignée sur ITIL — idéale pour les organisations qui gèrent leurs services IT internes, leurs installations, leurs ressources humaines, et plus encore.",
  " (Professional Services Automation) is built for managed service providers and technology companies that need to manage client tickets, billing, contracts, time tracking, and projects in one place.":
    " (automatisation des services professionnels) est conçu pour les prestataires de services gérés et les entreprises technologiques qui doivent gérer en un seul endroit les tickets clients, la facturation, les contrats, le suivi du temps et les projets.",
  " is an omnichannel customer relationship platform for sales, marketing, and customer service teams. As a full Halo partner, EquaCore can implement and support any or all three.":
    " est une plateforme de relation client omnicanale pour les équipes commerciales, marketing et service client. En tant que partenaire Halo à part entière, EquaCore peut implémenter et assurer le support de l'un ou de l'ensemble de ces trois produits.",
  "All three are products from Halo Service Solutions built on the same platform, but designed for different audiences.":
    "Ces trois produits de Halo Service Solutions reposent sur la même plateforme, mais s'adressent à des publics différents.",
  "What engagement models does EquaCore offer?": "Quels modèles d'engagement EquaCore propose-t-il ?",
  "We offer project-based delivery (defined scope and milestones), ongoing managed services (monthly retainer), embedded consulting and staff augmentation (professionals integrated into your team), and hybrid models that combine delivery with knowledge transfer.":
    "Nous proposons une livraison au projet (périmètre et jalons définis), des services gérés en continu (forfait mensuel), du conseil intégré et du renfort de personnel (professionnels intégrés à votre équipe), ainsi que des modèles hybrides combinant livraison et transfert de compétences.",

  // ---- CTA band (home) ----
  "See how we'd run your engagement — in 30 minutes.": "Découvrez comment nous mènerions votre mission — en 30 minutes.",
  "A working session with a practitioner, not a sales deck.": "Une session de travail avec un praticien, pas une présentation commerciale.",
  "Or send us a message": "Ou envoyez-nous un message",

  // ---- Services page ----
  "Our Services": "Nos services",
  "What We Deliver": "Ce que nous livrons",
  "A quick scan of EquaCore's primary offerings — from enterprise platform implementation to talent augmentation.":
    "Un aperçu rapide des principales offres d'EquaCore — de l'implémentation de plateformes d'entreprise au renfort de talents.",
  "Full Halo partner delivering HaloITSM, HaloPSA, and HaloCRM — implementation, legacy migration, process alignment, and ongoing managed support across all three products.":
    "Partenaire Halo à part entière livrant HaloITSM, HaloPSA et HaloCRM — implémentation, migration d'outils existants, alignement des processus et support géré continu sur les trois produits.",
  "ServiceNow Services": "Services ServiceNow",
  "Pre-vetted ServiceNow talent for placement and embedded teams, day-2 managed operations, and independent platform advisory. Supporting organisations using the ServiceNow® platform.":
    "Des talents ServiceNow présélectionnés pour le placement et les équipes intégrées, une exploitation gérée au quotidien et un conseil plateforme indépendant, au service des organisations qui utilisent la plateforme ServiceNow®.",
  "Pre-vetted Nigerian ServiceNow professionals ready for global enterprise delivery, with flexible engagement structures.":
    "Des professionnels ServiceNow nigérians présélectionnés, prêts pour une livraison en entreprise à l'international, avec des formats d'engagement flexibles.",

  // ---- ServiceNow page ----
  "ServiceNow Talent & Managed Services in Nigeria": "Talents ServiceNow et services gérés au Nigeria",
  "Nigeria-based ServiceNow specialists — pre-vetted talent, hands-on managed operations, and independent advisory for organisations using the ServiceNow® platform in Nigeria and worldwide.":
    "Des spécialistes ServiceNow basés au Nigeria — talents présélectionnés, exploitation gérée sur le terrain et conseil indépendant pour les organisations qui utilisent la plateforme ServiceNow® au Nigeria et dans le monde.",
  "ServiceNow in Nigeria": "ServiceNow au Nigeria",
  "ServiceNow Consulting & Talent in Nigeria": "Conseil et talents ServiceNow au Nigeria",
  "EquaCore Digital is a Nigeria-based ServiceNow advisory firm headquartered in Lagos. We help organisations in Nigeria and across West Africa adopt, deploy, and operate the ServiceNow® platform — through pre-vetted talent, day-2 managed services, and independent advisory, with delivery that extends to clients in the UK, Europe, and beyond.":
    "EquaCore Digital est un cabinet de conseil ServiceNow basé au Nigeria, dont le siège est à Lagos. Nous aidons les organisations du Nigeria et d'Afrique de l'Ouest à adopter, déployer et exploiter la plateforme ServiceNow® — grâce à des talents présélectionnés, des services gérés au quotidien et un conseil indépendant, avec une livraison qui s'étend à des clients au Royaume-Uni, en Europe et au-delà.",
  "Is ServiceNow used in Nigeria?": "ServiceNow est-il utilisé au Nigeria ?",
  "Yes. ServiceNow is used by banks, telecoms, and large enterprises operating in Nigeria for IT service management, HR service delivery, and digital workflow automation. Adoption is growing as Nigerian organisations modernise their operations, supported by an active local ServiceNow developer community.":
    "Oui. ServiceNow est utilisé par des banques, des opérateurs télécoms et de grandes entreprises présentes au Nigeria pour la gestion des services IT, la livraison de services RH et l'automatisation des flux numériques. Son adoption progresse à mesure que les organisations nigérianes modernisent leurs opérations, soutenues par une communauté locale active de développeurs ServiceNow.",
  "Can I hire ServiceNow developers in Nigeria?": "Puis-je recruter des développeurs ServiceNow au Nigeria ?",
  "Yes. EquaCore places pre-vetted, enterprise-ready ServiceNow administrators, developers, solution architects, and business analysts based in Nigeria — available for embedded teams, contract, or permanent placement with clients locally and globally.":
    "Oui. EquaCore place des administrateurs, développeurs, architectes de solutions et analystes métier ServiceNow présélectionnés et prêts pour l'entreprise, basés au Nigeria — disponibles pour des équipes intégrées, des missions en contrat ou des placements permanents auprès de clients locaux et internationaux.",
  "Who provides ServiceNow deployment and consulting in Nigeria?": "Qui assure le déploiement et le conseil ServiceNow au Nigeria ?",
  "EquaCore Digital provides ServiceNow deployment, integration, managed services, and independent advisory from Lagos, Nigeria. Engagements run with structured governance, clear SLAs, and measurable outcomes.":
    "EquaCore Digital assure le déploiement, l'intégration, les services gérés et le conseil indépendant ServiceNow depuis Lagos, au Nigeria. Nos missions se déroulent avec une gouvernance structurée, des SLA clairs et des résultats mesurables.",
  "ServiceNow Talent, Enterprise-Ready": "Des talents ServiceNow prêts pour l'entreprise",
  "Our largest practice. Pre-vetted ServiceNow professionals placed with global organisations as embedded contributors, contract resources, or permanent hires. Every consultant is technically assessed, mentored, and ready for delivery from day one.":
    "Notre plus grande pratique. Des professionnels ServiceNow présélectionnés, placés auprès d'organisations internationales en tant que contributeurs intégrés, ressources en contrat ou recrutements permanents. Chaque consultant est évalué techniquement, mentoré et prêt à intervenir dès le premier jour.",
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
  " permanent placement, fixed-term contract, and embedded squads. We carry the recruiting risk — you only pay for talent that lands and performs.":
    " placement permanent, contrat à durée déterminée et équipes intégrées. Nous assumons le risque de recrutement — vous ne payez que pour des talents qui s'intègrent et qui performent.",
  "Are you a ServiceNow specialist? Join the talent pool": "Vous êtes spécialiste ServiceNow ? Rejoignez notre vivier de talents",
  "Managed Services": "Services gérés",
  "ServiceNow Operations, Done Right": "Une exploitation ServiceNow bien menée",
  "Day-2 operations support that keeps your platform healthy as your organisation grows. Our team handles routine administration, incident response, and continuous tuning — with clear SLAs, transparent reporting, and predictable retainers.":
    "Un support d'exploitation au quotidien qui maintient votre plateforme en bonne santé à mesure que votre organisation grandit. Notre équipe assure l'administration courante, la réponse aux incidents et l'optimisation continue — avec des SLA clairs, un reporting transparent et des forfaits prévisibles.",
  "Platform Administration & User Management": "Administration de la plateforme et gestion des utilisateurs",
  "Routine configuration, role & group governance, instance hygiene.":
    "Configuration courante, gouvernance des rôles et groupes, entretien de l'instance.",
  "Incident, Problem & Change Support": "Support incidents, problèmes et changements",
  "Backstop for your ITIL processes — escalations handled, root causes found, changes governed.":
    "Un filet de sécurité pour vos processus ITIL — escalades traitées, causes racines identifiées, changements gouvernés.",
  "Patching & Release Cadence": "Cadence de correctifs et de mises en production",
  "Disciplined approach to family release uptake, patching cycles, and regression-tested rollouts.":
    "Une approche rigoureuse de l'adoption des versions majeures, des cycles de correctifs et des déploiements testés en non-régression.",
  "Performance Monitoring & Tuning": "Suivi et optimisation des performances",
  "Slow-by-default platforms become fast-by-design — query tuning, indexing, scheduled job optimisation.":
    "Des plateformes lentes par défaut deviennent rapides par conception — optimisation des requêtes, indexation, optimisation des tâches planifiées.",
  "Continuous Improvement & Backlog": "Amélioration continue et backlog",
  "We grow your platform through iterative enhancements — not one-shot projects.":
    "Nous faisons évoluer votre plateforme par des améliorations itératives — pas par des projets ponctuels.",
  "How we engage:": "Comment nous intervenons :",
  " monthly retainer with named primary & secondary engineers, capacity-based hours, defined SLAs, and a quarterly business review.":
    " forfait mensuel avec ingénieurs principal et secondaire nommément désignés, heures allouées par capacité, SLA définis et un bilan trimestriel.",
  "Advisory & Optimisation": "Conseil et optimisation",
  "Independent ServiceNow Advisory": "Conseil ServiceNow indépendant",
  "For leaders evaluating, optimising, or rationalising their ServiceNow estate. We bring senior practitioner experience and deliberate independence — we have no resale, licensing, or partner-program incentive shaping our recommendations.":
    "Pour les dirigeants qui évaluent, optimisent ou rationalisent leur parc ServiceNow. Nous apportons une expérience de praticiens confirmés et une indépendance délibérée — aucune revente, licence ou programme partenaire ne vient influencer nos recommandations.",
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
  "License & Module Rationalisation": "Rationalisation des licences et des modules",
  "Right-size your subscription against actual usage — defensible recommendations, not vendor talking points.":
    "Ajustez votre abonnement à l'usage réel — des recommandations justifiables, pas des arguments d'éditeur.",
  "Our independence:": "Notre indépendance :",
  " We hold no ServiceNow reseller, partner, or licensing arrangement. Our recommendations reflect what's best for your platform — nothing else.":
    " Nous ne détenons aucun accord de revente, de partenariat ou de licence ServiceNow. Nos recommandations reflètent uniquement ce qui est le mieux pour votre plateforme.",
  "Need ServiceNow talent, ops support, or a second opinion?": "Besoin de talents ServiceNow, d'un support d'exploitation ou d'un second avis ?",
  "Tell us where you are — placement, managed services, or advisory — and we'll match the right team.":
    "Dites-nous où vous en êtes — placement, services gérés ou conseil — et nous composerons l'équipe adaptée.",
  "Talk to a Specialist →": "Parler à un spécialiste →",

  // ---- Halo (haloitsm) page ----
  "Full Halo Partner": "Partenaire Halo à part entière",
  "Authorised to deliver the complete Halo platform — HaloITSM, HaloPSA, and HaloCRM — across full-lifecycle implementations, migrations, and managed operations.":
    "Habilités à livrer l'ensemble de la plateforme Halo — HaloITSM, HaloPSA et HaloCRM — de l'implémentation de bout en bout aux migrations et à l'exploitation gérée.",
  "The Halo Platform": "La plateforme Halo",
  "Three Products. One Partner.": "Trois produits. Un seul partenaire.",
  "As a full Halo partner, EquaCore is authorised to implement, configure, and support all three Halo products — with no module restrictions and no per-product limitations.":
    "En tant que partenaire Halo à part entière, EquaCore est habilité à implémenter, configurer et assurer le support des trois produits Halo — sans restriction de module ni limitation par produit.",
  "ITIL-aligned IT and Enterprise Service Management — Incident, Problem, Change, CMDB, Asset Management, Service Catalogue, and more. All modules included as standard.":
    "Gestion des services IT et d'entreprise alignée sur ITIL — incidents, problèmes, changements, CMDB, gestion des actifs, catalogue de services, et plus encore. Tous les modules sont inclus en standard.",
  "For: Enterprises & IT Teams": "Pour : entreprises et équipes IT",
  "Professional Services Automation built for MSPs, cloud providers, and telecoms. Ticketing, billing, contracts, time tracking, and CRM — all in one all-inclusive platform.":
    "Automatisation des services professionnels conçue pour les MSP, fournisseurs cloud et opérateurs télécoms. Ticketing, facturation, contrats, suivi du temps et CRM — le tout dans une plateforme tout compris.",
  "For: MSPs & Service Providers": "Pour : MSP et prestataires de services",
  "Omnichannel CRM unifying sales, marketing, and customer service. Pipelines, campaigns, ticketing, and AI-powered lead scoring — without the enterprise price tag.":
    "CRM omnicanal unifiant ventes, marketing et service client. Pipelines, campagnes, ticketing et notation des prospects par IA — sans le prix d'une solution d'entreprise.",
  "For: Customer-Facing Teams": "Pour : équipes en contact avec la clientèle",
  "IT & Enterprise Service Management": "Gestion des services IT et d'entreprise",
  "A unified, ITIL-aligned platform — every module included as standard with no per-feature licensing. Purpose-built for organisations running IT, HR, facilities, and finance service desks on one platform.":
    "Une plateforme unifiée, alignée sur ITIL — chaque module est inclus en standard, sans licence à la fonctionnalité. Conçue pour les organisations qui font tourner leurs services IT, RH, facilities et finance sur une seule plateforme.",
  "Incident & Problem Management": "Gestion des incidents et des problèmes",
  "ITIL-aligned incident handling with SLA management, AI-powered triage, and root cause investigation — reducing repeat failures and cutting resolution times.":
    "Une gestion des incidents alignée sur ITIL avec suivi des SLA, tri assisté par IA et recherche de cause racine — pour réduire les pannes récurrentes et raccourcir les délais de résolution.",
  "Change & Release Management": "Gestion des changements et des mises en production",
  "CAB workflows, standardised change procedures, and disciplined release tracking — from minor fixes to major platform rollouts.":
    "Des flux de comité de changement, des procédures normalisées et un suivi rigoureux des mises en production — des correctifs mineurs aux déploiements majeurs.",
  "CMDB & Asset Management": "CMDB et gestion des actifs",
  "Track configuration items, visualise CI dependencies, and auto-discover assets — giving your team a reliable foundation for all service management decisions.":
    "Suivez les éléments de configuration, visualisez leurs dépendances et découvrez automatiquement les actifs — pour donner à votre équipe une base fiable pour toutes les décisions de gestion des services.",
  "Service Catalogue & Self-Service Portal": "Catalogue de services et portail libre-service",
  "ITIL-compliant service catalogue with a fully brandable self-service portal — users find and request services without calling the help desk.":
    "Un catalogue de services conforme ITIL, avec un portail libre-service entièrement personnalisable — les utilisateurs trouvent et demandent des services sans appeler le support.",
  "Knowledge Management": "Gestion des connaissances",
  "Rich knowledge base with AI-generated articles, full-text search, and articles surfaced to users before they raise a ticket — deflecting volume at the source.":
    "Une base de connaissances riche, avec articles générés par IA, recherche en texte intégral et suggestions d'articles avant même l'ouverture d'un ticket — pour réduire le volume à la source.",
  "Automation & Halo AI": "Automatisation et Halo AI",
  "No-code workflow automation, AI triage, Emotion AI, Virtual Agent, and automated resolutions for routine tickets — reducing manual workload at scale.":
    "Automatisation de flux sans code, tri par IA, Emotion AI, agent virtuel et résolutions automatisées pour les tickets courants — pour réduire la charge manuelle à grande échelle.",
  "Major Incident & Project Management": "Gestion des incidents majeurs et des projets",
  "A dedicated Major Incident console with 5C coordination (Command, Control, Comms, Coordination, Cooperation) — and full project portfolio tooling built in.":
    "Une console dédiée aux incidents majeurs avec coordination 5C (commandement, contrôle, communication, coordination, coopération) — et un outillage complet de portefeuille de projets intégré.",
  "Enterprise Service Management:": "Gestion des services d'entreprise :",
  " HaloITSM extends beyond IT — HR, Facilities, Finance, and Legal teams can all operate service desks on the same platform, sharing a single system of record.":
    " HaloITSM va au-delà de l'IT — les équipes RH, facilities, finance et juridique peuvent toutes exploiter leur support sur la même plateforme, en partageant un système d'enregistrement unique.",
  "All modules included:": "Tous les modules inclus :",
  " Unlike many competitors, Halo does not charge per module. Every capability listed here — including Halo AI — is included as standard in the licence.":
    " Contrairement à de nombreux concurrents, Halo ne facture pas à la fonctionnalité. Toutes les capacités listées ici — y compris Halo AI — sont incluses en standard dans la licence.",
  "Professional Services Automation for MSPs": "Automatisation des services professionnels pour les MSP",
  "The all-inclusive PSA platform built for managed service providers, cloud solution providers, and telecoms companies. Consolidate ticketing, billing, contracts, projects, and CRM — eliminating the need for multiple disconnected tools.":
    "La plateforme PSA tout compris conçue pour les prestataires de services gérés, les fournisseurs de solutions cloud et les opérateurs télécoms. Elle regroupe ticketing, facturation, contrats, projets et CRM — supprimant le besoin de multiples outils déconnectés.",
  "Service Desk & Multi-Client Ticketing": "Support et ticketing multi-clients",
  "MSP-focused ticketing with SLA management, automated workflows, and centralised multi-client communications — all in one console.":
    "Un ticketing pensé pour les MSP, avec suivi des SLA, flux automatisés et communications multi-clients centralisées — le tout dans une seule console.",
  "Billing, Contracts & Invoicing": "Facturation, contrats et devis",
  "Zero-touch invoice creation, contract renewal automation, and per-agreement billing rules — integrated with leading accounting platforms including Xero and QuickBooks.":
    "Création de factures sans intervention, automatisation du renouvellement des contrats et règles de facturation par contrat — intégré aux principales plateformes comptables, dont Xero et QuickBooks.",
  "Time Tracking": "Suivi du temps",
  "Automatically capture time across all customer interaction points — ensuring accurate pay-as-you-go billing and genuine project cost visibility.":
    "Capturez automatiquement le temps passé sur tous les points de contact client — pour une facturation à l'usage précise et une réelle visibilité sur les coûts de projet.",
  "Sales & CRM": "Ventes et CRM",
  "Pipeline management, opportunity tracking, and full contact history — helping MSPs grow accounts and retain customers with data-driven insight.":
    "Gestion du pipeline, suivi des opportunités et historique complet des contacts — pour aider les MSP à développer leurs comptes et fidéliser leurs clients grâce à des données concrètes.",
  "Project Management": "Gestion de projet",
  "From simple tasks to complex client portfolios — real-time project dashboards, resource planning, and automated Statement of Work generation.":
    "Des tâches simples aux portefeuilles clients complexes — tableaux de bord projet en temps réel, planification des ressources et génération automatisée de cahiers des charges.",
  "Asset & Stock Management": "Gestion des actifs et des stocks",
  "Track client assets and configuration items, manage stock levels and costing, and log incidents directly against assets for rapid diagnosis.":
    "Suivez les actifs clients et les éléments de configuration, gérez les niveaux de stock et les coûts, et enregistrez les incidents directement sur les actifs pour un diagnostic rapide.",
  "Who is HaloPSA for?": "À qui s'adresse HaloPSA ?",
  " Managed Service Providers, Telecoms companies, Cloud Solution Providers, consultancy firms, and software businesses that need a single operational platform to manage clients, delivery, and finance.":
    " Aux prestataires de services gérés, opérateurs télécoms, fournisseurs de solutions cloud, cabinets de conseil et éditeurs de logiciels qui ont besoin d'une plateforme opérationnelle unique pour gérer clients, livraison et finance.",
  "Competing with:": "Face à :",
  " ConnectWise, Autotask, Atera, and Kaseya BMS — at lower total cost of ownership, with every module included as standard from day one.":
    " ConnectWise, Autotask, Atera et Kaseya BMS — avec un coût total de possession plus bas et tous les modules inclus en standard dès le premier jour.",
  "Omnichannel CRM for Customer Teams": "CRM omnicanal pour les équipes clientèle",
  "Unify sales, marketing, and customer service in one platform. HaloCRM brings together pipeline management, campaign automation, omnichannel ticketing, and AI-powered lead scoring — eliminating data silos between customer-facing teams.":
    "Unifiez ventes, marketing et service client sur une seule plateforme. HaloCRM réunit gestion du pipeline, automatisation des campagnes, ticketing omnicanal et notation des prospects par IA — supprimant les silos de données entre équipes en contact avec la clientèle.",
  "Omnichannel Customer Service": "Service client omnicanal",
  "Unify email, live chat, phone, and social media into a single agent workspace — consistent, fast, personalised service across every channel.":
    "Unifiez e-mail, chat en direct, téléphone et réseaux sociaux dans un espace de travail unique pour les agents — un service cohérent, rapide et personnalisé sur chaque canal.",
  "Sales Pipelines & Opportunity Management": "Pipelines commerciaux et gestion des opportunités",
  "Drag-and-drop pipelines, weighted deal values, and multi-team pipeline management — full visibility from first contact to close.":
    "Pipelines par glisser-déposer, valeurs pondérées des affaires et gestion multi-équipes du pipeline — une visibilité complète du premier contact jusqu'à la signature.",
  "Marketing & Campaign Automation": "Marketing et automatisation des campagnes",
  "Automated customer journey sequences, lead capture forms, and campaign management — turning interest into revenue with less manual effort.":
    "Séquences automatisées de parcours client, formulaires de capture de prospects et gestion des campagnes — pour transformer l'intérêt en revenu avec moins d'effort manuel.",
  "AI Lead Scoring & Virtual Agents": "Notation des prospects par IA et agents virtuels",
  "AI-powered lead scoring identifies your best opportunities automatically, while 24/7 virtual agents handle routine customer queries without human intervention.":
    "La notation des prospects par IA identifie automatiquement vos meilleures opportunités, tandis que des agents virtuels disponibles 24 h/24 traitent les demandes courantes sans intervention humaine.",
  "Reporting & Customer Intelligence": "Reporting et connaissance client",
  "Data-driven dashboards and AI-flagged trend analysis — surfacing the customers and opportunities that need attention before they become problems.":
    "Des tableaux de bord basés sur les données et une analyse des tendances signalée par IA — pour repérer les clients et opportunités qui méritent attention avant qu'ils ne deviennent des problèmes.",
  "Who is HaloCRM for?": "À qui s'adresse HaloCRM ?",
  " Organisations with customer-facing sales, marketing, and service teams that need a single source of truth — replacing disconnected CRM, ticketing, and marketing tools with one integrated platform.":
    " Aux organisations dont les équipes ventes, marketing et service client ont besoin d'une source de vérité unique — en remplaçant des outils CRM, de ticketing et marketing déconnectés par une seule plateforme intégrée.",
  "Our Practice": "Notre pratique",
  "What We Deliver Across All Halo Products": "Ce que nous livrons sur l'ensemble des produits Halo",
  "Whether you're implementing HaloITSM, HaloPSA, or HaloCRM — our delivery practice follows the same disciplined approach from scoping through go-live and beyond.":
    "Que vous implémentiez HaloITSM, HaloPSA ou HaloCRM, notre pratique de livraison suit la même approche rigoureuse, du cadrage à la mise en service et au-delà.",
  "Platform Implementation & Configuration": "Implémentation et configuration de la plateforme",
  "End-to-end deployment and configuration of any Halo product, tailored to your operational requirements and ITIL or business processes.":
    "Déploiement et configuration de bout en bout de n'importe quel produit Halo, adaptés à vos besoins opérationnels et à vos processus ITIL ou métier.",
  "Migration from Legacy Tools": "Migration depuis des outils existants",
  "Structured migrations from Jira, Freshdesk, Zendesk, Autotask, ConnectWise, and other ITSM, PSA, or CRM platforms — with data-integrity checks and minimal disruption.":
    "Des migrations structurées depuis Jira, Freshdesk, Zendesk, Autotask, ConnectWise et d'autres plateformes ITSM, PSA ou CRM — avec contrôles d'intégrité des données et une perturbation minimale.",
  "Process Alignment & Automation": "Alignement et automatisation des processus",
  "Designing workflows and automations that reflect how your organisation actually works — not generic templates imposed from outside.":
    "Concevoir des flux et des automatisations qui reflètent le fonctionnement réel de votre organisation — pas des modèles génériques imposés de l'extérieur.",
  "User Onboarding & Knowledge Transfer": "Prise en main utilisateurs et transfert de compétences",
  "Structured onboarding so your team owns the platform from day one — not dependent on us for routine operations after go-live.":
    "Une prise en main structurée pour que votre équipe maîtrise la plateforme dès le premier jour — sans dépendre de nous pour les opérations courantes après la mise en service.",
  "Post-Go-Live Managed Support": "Support géré après mise en service",
  "Ongoing platform administration, enhancement delivery, and optimisation — keeping your Halo investment running at peak performance long after launch.":
    "Administration continue de la plateforme, livraison d'améliorations et optimisation — pour que votre investissement Halo reste au meilleur de ses performances longtemps après le lancement.",
  "Our emphasis:": "Notre priorité :",
  " Faster time-to-value while maintaining operational discipline. We get you running without cutting corners — and we stay close enough to fix things quickly if needed.":
    " Un temps de valorisation plus rapide, sans sacrifier la rigueur opérationnelle. Nous vous mettons en route sans raccourcis — et restons suffisamment proches pour corriger rapidement si besoin.",
  "Ready to implement a Halo product?": "Prêt à implémenter un produit Halo ?",
  "Whether it's HaloITSM, HaloPSA, or HaloCRM — from fresh deployments to legacy migrations, we'll get you operational with confidence.":
    "Qu'il s'agisse de HaloITSM, HaloPSA ou HaloCRM — d'un nouveau déploiement à une migration d'outils existants, nous vous rendrons opérationnels en toute confiance.",
  "Get in Touch →": "Nous contacter →",

  // ---- Talent page ----
  "Book a 30-minute talent call": "Réserver un échange talents de 30 minutes",
  "Join Our Talent Pool": "Rejoindre notre vivier de talents",
  "Pre-vetted Nigerian ServiceNow professionals deployed globally.": "Des professionnels ServiceNow nigérians présélectionnés, déployés dans le monde entier.",
  "Our Model": "Notre modèle",
  "Quality Talent, Global Reach": "Des talents de qualité, une portée mondiale",
  "Exceptional ServiceNow professionals from Nigeria — rigorously vetted, mentored, and ready.":
    "Des professionnels ServiceNow d'exception venus du Nigeria — rigoureusement sélectionnés, mentorés et prêts à intervenir.",
  "Pre-Vetted Professionals": "Professionnels présélectionnés",
  "Rigorous assessment covering technical skills, communication, and enterprise readiness.":
    "Une évaluation rigoureuse portant sur les compétences techniques, la communication et la préparation à l'entreprise.",
  "Mentorship & Development": "Mentorat et développement",
  "Ongoing mentorship keeps talent sharp and aligned with best practices.":
    "Un mentorat continu qui maintient les talents affûtés et alignés sur les meilleures pratiques.",
  "Flexible Engagement Structures": "Formats d'engagement flexibles",
  "Choose between embedded consulting and staff augmentation models.":
    "Choisissez entre conseil intégré et modèles de renfort de personnel.",
  "Impact": "Impact",
  "Building Africa's ServiceNow Ecosystem": "Construire l'écosystème ServiceNow de l'Afrique",
  "Beyond staffing, EquaCore nurtures Nigeria's ServiceNow talent pool through community initiatives and developer ecosystem growth.":
    "Au-delà du placement, EquaCore fait grandir le vivier de talents ServiceNow du Nigeria à travers des initiatives communautaires et le développement de l'écosystème de développeurs.",
  "Our Community Impact →": "Notre impact communautaire →",
  "Need ServiceNow or Halo talent?": "Besoin de talents ServiceNow ou Halo ?",
  "Access our network of enterprise-ready professionals.": "Accédez à notre réseau de professionnels prêts pour l'entreprise.",
  "Discuss Your Needs →": "Discuter de vos besoins →",
  "Are you a ServiceNow professional? ": "Vous êtes un professionnel ServiceNow ? ",
  "Register for our talent pool →": "Inscrivez-vous à notre vivier de talents →",

  // ---- Engagement page ----
  "How We Work With You": "Comment nous travaillons avec vous",
  "Flexible engagement structures designed to match your project needs and business objectives.":
    "Des formats d'engagement flexibles conçus pour répondre aux besoins de votre projet et à vos objectifs métier.",
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
  "Continuous platform support, enhancement, and optimisation. For organisations that need a trusted partner to evolve their platform over time.":
    "Support, amélioration et optimisation continus de la plateforme. Pour les organisations qui ont besoin d'un partenaire de confiance pour faire évoluer leur plateforme dans la durée.",
  "Integrated": "Intégré",
  "Embedded Consulting & Staff Augmentation": "Conseil intégré et renfort de personnel",
  "Place EquaCore professionals directly within your teams, bringing expertise while transferring knowledge to build internal capability.":
    "Intégrez des professionnels EquaCore directement au sein de vos équipes, apportant leur expertise tout en transférant des compétences pour renforcer vos capacités internes.",
  "Blended": "Combiné",
  "Hybrid Delivery Models": "Modèles de livraison hybrides",
  "Combine delivery and enablement in a single engagement. We implement while simultaneously upskilling your team.":
    "Combinez livraison et accompagnement dans une seule mission. Nous implémentons tout en montant en compétences votre équipe.",
  "Not sure which model fits?": "Vous hésitez sur le modèle adapté ?",
  "Let's talk through your situation and recommend the right engagement structure.":
    "Discutons de votre situation et recommandons le format d'engagement adapté.",
  "Let's Discuss →": "Discutons-en →",

  // ---- Partner credentials (home hero + About) ----
  "Full Anthropic Partner": "Partenaire Anthropic complet",
  "Partnerships": "Partenariats",
  "Technology Partnerships": "Partenariats technologiques",
  "EquaCore Digital is a full Anthropic partner, alongside our full Halo Technology Alliance Partner status.":
    "EquaCore Digital est partenaire Anthropic complet, aux côtés de notre statut de partenaire complet de la Halo Technology Alliance.",

  // ---- About page ----
  "Built by practitioners,": "Construit par des praticiens,",
  "for practitioners": "pour des praticiens",
  "EquaCore was founded by experienced service management professionals who believe in implementation over theory — discipline over shortcuts, and outcomes over activity.":
    "EquaCore a été fondé par des professionnels expérimentés de la gestion des services qui privilégient la mise en œuvre à la théorie, la rigueur aux raccourcis, et les résultats à l'activité.",
  "What drives us forward": "Ce qui nous fait avancer",
  "Our vision and mission shape every engagement — from how we scope a project to how we measure success.":
    "Notre vision et notre mission façonnent chaque mission — de la façon dont nous cadrons un projet à celle dont nous mesurons la réussite.",
  "Our Vision": "Notre vision",
  "Enabling organisations to operate intelligently and adapt continuously": "Permettre aux organisations d'opérer intelligemment et de s'adapter en continu",
  "To enable organisations to operate intelligently and adapt continuously by delivering practical digital solutions and connecting them with strong technology talent — across platforms, borders, and industries.":
    "Permettre aux organisations d'opérer intelligemment et de s'adapter en continu en livrant des solutions numériques concrètes et en les mettant en relation avec des talents technologiques solides — quelles que soient les plateformes, les frontières ou les secteurs.",
  "Our Mission": "Notre mission",
  "Combining deep expertise with scalable talent solutions": "Allier une expertise pointue à des solutions de talents évolutives",
  "To help organisations design, implement, and evolve modern digital operations by combining deep implementation expertise with scalable talent solutions.":
    "Aider les organisations à concevoir, implémenter et faire évoluer des opérations numériques modernes en alliant une expertise d'implémentation pointue à des solutions de talents évolutives.",
  "What We Stand For": "Ce que nous défendons",
  "The principles behind every engagement": "Les principes qui sous-tendent chaque mission",
  "These aren't values on a wall — they're embedded into how we plan, deliver, and measure every project.":
    "Ce ne sont pas des valeurs affichées sur un mur — elles sont ancrées dans notre façon de planifier, de livrer et de mesurer chaque projet.",
  "Delivery Discipline": "Rigueur de livraison",
  "Every engagement is governed — structure, accountability, and measurable milestones, not just implementation. No surprises, no scope drift.":
    "Chaque mission est gouvernée — structure, responsabilisation et jalons mesurables, pas seulement une implémentation. Pas de surprises, pas de dérive de périmètre.",
  "Our goal is your independence. We build internal capability so your team can own and evolve the solution — not create long-term dependency on us.":
    "Notre objectif est votre autonomie. Nous renforçons vos compétences internes pour que votre équipe puisse s'approprier et faire évoluer la solution — sans créer de dépendance durable envers nous.",
  "Community Focus": "Engagement communautaire",
  "We invest in the Nigerian tech ecosystem through mentorship, talent development, and ServiceNow community initiatives — growing the pool we draw from.":
    "Nous investissons dans l'écosystème technologique nigérian par le mentorat, le développement des talents et des initiatives communautaires ServiceNow — en faisant grandir le vivier dans lequel nous puisons.",
  "Client Partnership": "Partenariat client",
  "We're technology agnostic. We recommend what's right for your business, not just the tools we sell. Long-term fit matters more than short-term commission.":
    "Nous sommes neutres vis-à-vis de la technologie. Nous recommandons ce qui convient à votre activité, pas seulement les outils que nous vendons. L'adéquation à long terme compte plus que la commission à court terme.",
  "Community Impact": "Impact communautaire",
  "Growing the ecosystem": "Faire grandir l'écosystème",
  "We foster developer communities through meetups, hackathons, and talent enablement initiatives — creating a sustainable ecosystem that nurtures growth and collaboration across Africa.":
    "Nous soutenons les communautés de développeurs à travers des rencontres, des hackathons et des initiatives d'accompagnement des talents — pour créer un écosystème durable qui favorise la croissance et la collaboration à travers l'Afrique.",
  "Meetups & Hackathons": "Rencontres et hackathons",
  "Organising community events that bring together aspiring tech professionals for hands-on learning and collaboration.":
    "Organiser des événements communautaires qui réunissent des professionnels de la tech en devenir autour de l'apprentissage pratique et de la collaboration.",
  "Talent Enablement": "Accompagnement des talents",
  "Structured mentorship and upskilling initiatives that prepare professionals for enterprise delivery at the highest level.":
    "Des initiatives structurées de mentorat et de montée en compétences qui préparent les professionnels à une livraison en entreprise au plus haut niveau.",
  "Knowledge Sharing": "Partage de connaissances",
  "Building a sustainable ecosystem that nurtures growth, collaboration, and knowledge sharing across Africa's tech landscape.":
    "Construire un écosystème durable qui favorise la croissance, la collaboration et le partage de connaissances dans le paysage technologique africain.",
  "Developer Ecosystem": "Écosystème de développeurs",
  "Growing a network of technologists and delivery leaders who back each other and raise the bar — beyond any single firm or platform.":
    "Faire grandir un réseau de spécialistes techniques et de responsables de livraison qui se soutiennent et élèvent le niveau — au-delà d'une seule entreprise ou plateforme.",
  "Ready to work with a team that delivers?": "Prêt à travailler avec une équipe qui livre ?",
  "Whether you're implementing a platform or scaling your ops team, we bring the discipline to get it done.":
    "Que vous implémentiez une plateforme ou que vous fassiez grandir votre équipe d'exploitation, nous apportons la rigueur nécessaire pour y parvenir.",

  // ---- Markets page ----
  "Global Reach, Local Expertise": "Portée mondiale, expertise locale",
  "Deep roots in Nigeria with expansion across Africa, Europe, and North America.":
    "Des racines profondes au Nigeria et une expansion à travers l'Afrique, l'Europe et l'Amérique du Nord.",
  "Our Regions": "Nos régions",
  "Where We Operate": "Où nous opérons",
  "Supporting organisations across diverse geographies and sectors.": "Nous accompagnons des organisations dans des zones géographiques et des secteurs variés.",
  "Nigeria": "Nigeria",
  "Primary market. Deep local expertise, talent network, and community initiatives.":
    "Marché principal. Expertise locale approfondie, réseau de talents et initiatives communautaires.",
  "Africa": "Afrique",
  "Expanding across the continent with implementation and talent services.":
    "En expansion sur le continent avec des services d'implémentation et de talents.",
  "Europe": "Europe",
  "Supporting European organisations with consulting and talent augmentation.":
    "Nous accompagnons les organisations européennes avec du conseil et du renfort de talents.",
  "North America": "Amérique du Nord",
  "Delivering enterprise platform expertise to North American clients.":
    "Nous livrons notre expertise plateforme d'entreprise à des clients nord-américains.",
  "We work with IT and Operations leaders responsible for service delivery and platform strategy — across small, mid-market, and enterprise organisations at every stage of platform maturity.":
    "Nous travaillons avec des responsables IT et Opérations en charge de la livraison des services et de la stratégie plateforme — au sein de petites structures, d'entreprises intermédiaires et de grands comptes, à tous les stades de maturité de plateforme.",
  "Operating in your region?": "Vous opérez dans votre région ?",
  "Let's explore how EquaCore can support your digital operations journey.":
    "Explorons comment EquaCore peut accompagner votre parcours d'opérations numériques.",
  "Start a Conversation →": "Engager la conversation →",

  // ---- Contact page ----
  "Let's Talk": "Parlons-en",
  "Whether you're exploring a new platform, optimizing what you have, or need ServiceNow talent — we'd love to hear from you.":
    "Que vous exploriez une nouvelle plateforme, optimisiez l'existant, ou ayez besoin de talents ServiceNow — nous serions ravis d'échanger avec vous.",
  "Send Us a Message": "Envoyez-nous un message",
  "Fill in the form below and we'll get back to you promptly. Prefer to talk it through? ":
    "Remplissez le formulaire ci-dessous et nous vous répondrons rapidement. Vous préférez en discuter de vive voix ? ",
  "Full Name *": "Nom complet *",
  "Email Address *": "Adresse e-mail *",
  "Company / Organisation": "Entreprise / Organisation",
  "Platform of Interest": "Plateforme d'intérêt",
  "Message *": "Message *",
  "Other / Not sure": "Autre / Je ne sais pas",
  "Send Message": "Envoyer le message",
  "Get in Touch Directly": "Nous contacter directement",
  "Prefer to reach out directly? Here's how to contact us.": "Vous préférez nous contacter directement ? Voici comment faire.",
  "General Enquiries": "Renseignements généraux",
  "Sales": "Ventes",
  "EquaCore Direct Line": "Ligne directe EquaCore",
  "Office": "Bureau",
  "Victoria Crest, Orchid Road,": "Victoria Crest, Orchid Road,",
  "Lekki, Lagos, Nigeria": "Lekki, Lagos, Nigeria",
  "We typically respond within 24 business hours.": "Nous répondons généralement sous 24 heures ouvrées.",

  // ---- Talent-pool page ----
  "Talent Pool": "Vivier de talents",
  "Join the EquaCore Talent Pool": "Rejoindre le vivier de talents EquaCore",
  "For ServiceNow and Halo platform specialists (HaloITSM, HaloPSA, HaloCRM) open to permanent, contract, or embedded opportunities with global organisations. Register your interest in two minutes — we'll be in touch when a fit emerges.":
    "Pour les spécialistes ServiceNow et des plateformes Halo (HaloITSM, HaloPSA, HaloCRM) ouverts à des opportunités permanentes, en contrat ou intégrées auprès d'organisations internationales. Inscrivez-vous en deux minutes — nous vous recontacterons dès qu'une opportunité correspondra à votre profil.",
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
  "ServiceNow & Halo Talent, Enterprise-Ready": "Des talents ServiceNow et Halo prêts pour l'entreprise",
  "Halo Talent": "Talents Halo",
  "Halo Specialists on the EquaCore Bench": "Des spécialistes Halo disponibles chez EquaCore",
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
  "Your details go straight into our secure system — nothing is shared with third parties.":
    "Vos informations sont transmises directement dans notre système sécurisé — rien n'est partagé avec des tiers.",
  "What Happens Next": "Et ensuite ?",
  "Here's our process from registration to placement.": "Voici notre processus, de l'inscription jusqu'au placement.",
  "1. Submit your registration": "1. Envoyez votre inscription",
  "Your CV and details land directly in our system within seconds.": "Votre CV et vos informations arrivent directement dans notre système en quelques secondes.",
  "2. We review your profile": "2. Nous examinons votre profil",
  "Within 24 business hours, we confirm receipt and match against open opportunities.":
    "Sous 24 heures ouvrées, nous confirmons la bonne réception et comparons votre profil aux opportunités ouvertes.",
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
  "We've got your enquiry and will be in touch within 24 business hours.":
    "Nous avons bien reçu votre demande et vous recontacterons sous 24 heures ouvrées.",
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
  "Your registration is now in our system. We'll review your profile within 24 business hours and reach out when a relevant opportunity emerges.":
    "Votre inscription est désormais dans notre système. Nous examinerons votre profil sous 24 heures ouvrées et vous contacterons dès qu'une opportunité pertinente se présentera.",
  "You're in the EquaCore Talent Pool": "Vous faites désormais partie du vivier de talents EquaCore",
  "Here's what happens next from our side.": "Voici ce qui se passe ensuite de notre côté.",
  "Step 1 — Profile review": "Étape 1 — Examen du profil",
  "Our team checks your CV and stated specialism within 24 business hours.":
    "Notre équipe examine votre CV et la spécialité indiquée sous 24 heures ouvrées.",
  "Step 2 — Opportunity matching": "Étape 2 — Rapprochement des opportunités",
  "We match your profile against current and pipeline roles across our client base.":
    "Nous comparons votre profil aux postes actuels et à venir au sein de notre clientèle.",
  "Step 3 — Direct outreach": "Étape 3 — Prise de contact directe",
  "If a relevant role surfaces, we'll reach out by email before sharing your profile with any employer.":
    "Si un poste pertinent se présente, nous vous contacterons par e-mail avant de partager votre profil avec un employeur.",
  "Questions in the meantime? Email ": "Des questions d'ici là ? Écrivez à ",

  // ---- Booking modal ----
  "Tell us who we're meeting": "Dites-nous qui nous allons rencontrer",
  "30 minutes with a practitioner, not a sales deck. A few details and we'll take you straight to the calendar.":
    "30 minutes avec un praticien, pas une présentation commerciale. Quelques informations et nous vous emmenons directement au calendrier.",
  "Work Email *": "E-mail professionnel *",
  "Continue to booking": "Continuer vers la réservation",
  "Opens Microsoft Bookings in a new tab. We never share your details.": "Ouvre Microsoft Bookings dans un nouvel onglet. Nous ne partageons jamais vos informations.",
  "Booking page didn't open? Click here": "La page de réservation ne s'est pas ouverte ? Cliquez ici",

  // ---- Footer ----
  "Digital operations consulting and implementation. Bridging operational strategy with hands-on platform delivery.":
    "Conseil et implémentation en opérations numériques. Faire le lien entre stratégie opérationnelle et livraison concrète de plateformes.",
  "Quick Links": "Liens rapides",
  "Book a Discussion": "Réserver un échange",
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
  "ServiceNow Nigeria — Consulting, Talent & Managed Services": "ServiceNow Nigeria — Conseil, talents et services gérés",
  "Halo Services (HaloITSM, HaloPSA, HaloCRM) — EquaCore Digital": "Services Halo (HaloITSM, HaloPSA, HaloCRM) — EquaCore Digital",
  "Talent Augmentation — EquaCore Digital": "Renfort de talents — EquaCore Digital",
  "Join Our Talent Pool — EquaCore Digital": "Rejoindre notre vivier de talents — EquaCore Digital",
  "Engagement Models — EquaCore Digital": "Modèles d'engagement — EquaCore Digital",
  "About — EquaCore Digital": "À propos — EquaCore Digital",
  "Markets Served — EquaCore Digital": "Marchés desservis — EquaCore Digital",
  "Privacy Policy — EquaCore Digital": "Politique de confidentialité — EquaCore Digital",
  "Thank You — EquaCore Digital": "Merci — EquaCore Digital",
  "Message Received — EquaCore Digital": "Message reçu — EquaCore Digital",

  // ---- SEO descriptions ----
  "EquaCore Digital is a full Halo partner delivering HaloITSM, HaloPSA, and HaloCRM implementations — plus ServiceNow talent augmentation, managed services, and independent advisory. Based in Nigeria, delivering globally.":
    "EquaCore Digital est un partenaire Halo à part entière livrant des implémentations HaloITSM, HaloPSA et HaloCRM — ainsi que du renfort de talents ServiceNow, des services gérés et du conseil indépendant. Basé au Nigeria, livrant dans le monde entier.",
  "EquaCore Digital delivers four services: ServiceNow talent augmentation, full Halo platform implementation (HaloITSM, HaloPSA, HaloCRM), managed services, and independent advisory.":
    "EquaCore Digital propose quatre services : renfort de talents ServiceNow, implémentation complète de la plateforme Halo (HaloITSM, HaloPSA, HaloCRM), services gérés et conseil indépendant.",
  "EquaCore Digital is a Nigeria-based ServiceNow practice offering consulting, talent augmentation, managed services, and independent advisory for organisations in Nigeria and worldwide. Headquartered in Lagos.":
    "EquaCore Digital est une pratique ServiceNow basée au Nigeria, proposant conseil, renfort de talents, services gérés et conseil indépendant aux organisations du Nigeria et du monde entier. Siège à Lagos.",
  "EquaCore Digital is a full Halo Technology Alliance Partner implementing HaloITSM, HaloPSA, and HaloCRM — covering migrations, process alignment, onboarding, and post-go-live managed support.":
    "EquaCore Digital est partenaire à part entière du Halo Technology Alliance, implémentant HaloITSM, HaloPSA et HaloCRM — migrations, alignement des processus, prise en main et support géré après mise en service.",
  "EquaCore Digital places pre-vetted, enterprise-ready ServiceNow professionals — administrators, developers, architects, BAs, and CMDB/Discovery/SAM specialists — with global enterprises.":
    "EquaCore Digital place des professionnels ServiceNow présélectionnés et prêts pour l'entreprise — administrateurs, développeurs, architectes, analystes métier et spécialistes CMDB/Discovery/SAM — auprès d'entreprises internationales.",
  "Join the EquaCore talent pool. ServiceNow and Halo professionals in Nigeria can register to be matched with enterprise placements across Nigeria, the UK, and Europe — permanent, contract, or embedded.":
    "Rejoignez le vivier de talents EquaCore. Les professionnels ServiceNow et Halo au Nigeria peuvent s'inscrire pour être rapprochés de placements en entreprise au Nigeria, au Royaume-Uni et en Europe — permanent, contrat ou intégré.",
  "EquaCore Digital engagement models: staff augmentation, managed services, and advisory — with structured governance and measurable outcomes for distributed teams.":
    "Modèles d'engagement EquaCore Digital : renfort de personnel, services gérés et conseil — avec une gouvernance structurée et des résultats mesurables pour des équipes réparties.",
  "EquaCore Digital is a practitioner-led digital operations firm specialising in ServiceNow and the full Halo platform, based in Nigeria and delivering globally.":
    "EquaCore Digital est un cabinet d'opérations numériques dirigé par des praticiens, spécialisé dans ServiceNow et l'ensemble de la plateforme Halo, basé au Nigeria et livrant dans le monde entier.",
  "EquaCore Digital serves clients across Nigeria, the UK, Europe, and West Africa with ServiceNow and Halo platform delivery backed by structured governance.":
    "EquaCore Digital sert des clients au Nigeria, au Royaume-Uni, en Europe et en Afrique de l'Ouest avec une livraison ServiceNow et Halo appuyée sur une gouvernance structurée.",
  "Contact EquaCore Digital to discuss ServiceNow talent, Halo platform implementation, managed services, or advisory. Based in Lagos, Nigeria, delivering globally.":
    "Contactez EquaCore Digital pour discuter de talents ServiceNow, d'implémentation de la plateforme Halo, de services gérés ou de conseil. Basé à Lagos, au Nigeria, livrant dans le monde entier.",
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
    "Nous n'avons pas pu vérifier votre candidature. Veuillez terminer la vérification de sécurité et réessayer."
};
const FR_ATTR = {
  "EquaCore Digital - Home": "EquaCore Digital - Accueil",
  "Main navigation": "Navigation principale",
  "Toggle navigation menu": "Afficher/masquer le menu de navigation",
  "Scroll to top": "Remonter en haut de la page",
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
  document.querySelectorAll('[placeholder],[aria-label],[alt],[title]').forEach(el => {
    ['placeholder', 'aria-label', 'alt', 'title'].forEach(attr => {
      const v = el.getAttribute(attr);
      if (v && FR_ATTR_NORM[norm(v)]) el.setAttribute(attr, FR_ATTR_NORM[norm(v)]);
    });
  });
  document.documentElement.lang = 'fr';
  if (FR_NORM[norm(document.title)]) document.title = FR_NORM[norm(document.title)];
  const btn = document.getElementById('langt');
  if (btn) { btn.textContent = 'EN'; btn.setAttribute('aria-label', 'Switch to English'); }
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
