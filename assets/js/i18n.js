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
  "The Health Check works whether you use Halo, Freshservice, ServiceNow®, another tool, or email and spreadsheets. We assess the operation first and recommend tools second.": "Le bilan s’applique que vous utilisiez Halo, Freshservice, ServiceNow®, un autre outil, ou des e-mails et des tableurs. Nous évaluons d’abord le fonctionnement des services, puis recommandons les outils.",
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
  "Digital operations, delivered right": "Opérations numériques, livrées comme il se doit",
  "Halo delivery.": "Livraison Halo.",
  "Independent ServiceNow® services.": "Services ServiceNow® indépendants.",
  "Independent ServiceNow services": "Services ServiceNow indépendants",
  "Pre-vetted talent.": "Talents présélectionnés.",
  "We implement and support HaloITSM, HaloPSA and HaloCRM. For organisations using the ServiceNow® platform, we provide ongoing managed operations and independent advisory. We also place pre-vetted talent into delivery teams.":
    "Nous implémentons et prenons en charge HaloITSM, HaloPSA et HaloCRM. Pour les organisations utilisant la plateforme ServiceNow®, nous assurons les opérations managées en continu et un conseil indépendant. Nous intégrons également des talents présélectionnés aux équipes de livraison.",
  "See the three offers": "Voir les trois offres",
  "View partner relationships": "Voir nos relations partenaires",
  "Delivery system": "Système de livraison",
  "Platform": "Plateforme",
  "Operations": "Opérations",
  "People": "Personnes",
  "Discover": "Découvrir",
  "Deliver": "Livrer",
  "Transfer": "Transférer",
  "Clear scope": "Périmètre clair",
  "Structured governance": "Gouvernance structurée",
  "Knowledge transfer": "Transfert de compétences",
  "Core services": "Services principaux",
  "Three clear ways we help.": "Trois façons claires de vous aider.",
  "Choose platform delivery, independent operations support or specialist talent—with the scope made clear before work begins.":
    "Choisissez la livraison de plateforme, le support opérationnel indépendant ou des talents spécialisés, avec un périmètre clarifié avant le début des travaux.",
  "Platform delivery": "Livraison de plateforme",
  "Halo platform delivery": "Livraison de la plateforme Halo",
  "Full-lifecycle delivery across HaloITSM, HaloPSA and HaloCRM—from implementation and legacy migration to process alignment, onboarding and managed support.":
    "Livraison sur l'ensemble du cycle de HaloITSM, HaloPSA et HaloCRM, de l'implémentation et la migration des outils existants à l'alignement des processus, la prise en main et le support géré.",
  "Implementation and migration": "Implémentation et migration",
  "Process alignment": "Alignement des processus",
  "Post-go-live support": "Support après mise en service",
  "Independent services": "Services indépendants",
  "ServiceNow® services": "Services ServiceNow®",
  "Ongoing managed operations and independent platform advisory for organisations using the ServiceNow® platform.":
    "Opérations managées en continu et conseil plateforme indépendant pour les organisations utilisant la plateforme ServiceNow®.",
  "Ongoing managed operations": "Opérations managées en continu",
  "Advisory and health checks": "Conseil et bilans de santé plateforme",
  "Process design and optimisation": "Conception et optimisation des processus",
  "Independent; no reseller or licensing arrangement": "Indépendant ; aucun accord de revente ou de licence",
  "Talent augmentation": "Renfort de talents",
  "Pre-vetted talent": "Talents présélectionnés",
  "Pre-vetted Nigerian ServiceNow professionals for embedded teams, contracts or permanent placement—supported by mentorship and enterprise readiness.":
    "Professionnels ServiceNow nigérians présélectionnés pour des équipes intégrées, des contrats ou des placements permanents, accompagnés par du mentorat et une préparation aux exigences de l'entreprise.",
  "Technical assessment": "Évaluation technique",
  "Mentorship and readiness": "Mentorat et préparation",
  "Flexible engagement structures": "Formats d'engagement flexibles",
  "Partner relationships": "Relations partenaires",
  "Four distinct relationships.": "Quatre relations distinctes.",
  "These relationships sit alongside our work in Talent, Managed Services, and Advisory. Our ServiceNow® services are independent.":
    "Ces relations complètent nos activités de talents, de services gérés et de conseil. Nos services ServiceNow® sont indépendants.",
  "We deliver HaloITSM, HaloPSA and HaloCRM across full-lifecycle implementations, legacy migrations, process alignment, user onboarding and post-go-live managed support.":
    "Nous livrons HaloITSM, HaloPSA et HaloCRM sur l'ensemble du cycle : implémentations, migrations d'outils existants, alignement des processus, prise en main utilisateurs et support géré après mise en service.",
  "Freshworks Partner": "Partenaire Freshworks",
  "We help organisations implement and improve Freshservice and Freshworks solutions, covering workflow configuration, integrations, data migration, user enablement and ongoing optimisation to strengthen service delivery and customer support.":
    "Nous aidons les organisations à implémenter et à améliorer Freshservice et les solutions Freshworks, en couvrant la configuration des flux de travail, les intégrations, la migration des données, l'accompagnement des utilisateurs et l'optimisation continue afin de renforcer la prestation de services et le support client.",
  "We help organisations adopt Claude responsibly through practical use-case design, secure integrations, knowledge workflows and AI-assisted delivery, with governance and human oversight built around your operating needs.":
    "Nous aidons les organisations à adopter Claude de manière responsable grâce à la conception de cas d'usage pratiques, à des intégrations sécurisées, à des flux de connaissances et à une livraison assistée par l'IA, avec une gouvernance et une supervision humaine adaptées à leurs besoins opérationnels.",
  "We design and integrate practical OpenAI-powered solutions, from knowledge assistants and workflow automation to bespoke applications, with a focus on security, responsible adoption and measurable business value.":
    "Nous concevons et intégrons des solutions pratiques basées sur OpenAI, des assistants de connaissances et de l'automatisation des flux de travail aux applications sur mesure, en mettant l'accent sur la sécurité, l'adoption responsable et une valeur métier mesurable.",
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
  "Platform implementation and improvement across HaloITSM, HaloPSA, HaloCRM, Freshservice and Freshworks solutions—covering workflow and process design, migrations, integrations, user enablement and ongoing optimisation.":
    "Implémentation et amélioration de plateformes sur HaloITSM, HaloPSA, HaloCRM, Freshservice et les solutions Freshworks, couvrant la conception des flux de travail et des processus, les migrations, les intégrations, l'accompagnement des utilisateurs et l'optimisation continue.",
  "Workflow and process design": "Conception des flux de travail et des processus",
  "Migrations and integrations": "Migrations et intégrations",
  "User enablement and optimisation": "Accompagnement des utilisateurs et optimisation",
  "Halo and Freshworks solutions": "Solutions Halo et Freshworks",
  "Explore Platform Delivery →": "Découvrir la livraison de plateformes →",
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
  "We help organisations adopt Claude responsibly through practical use-case design, integration design with permissions and approval points, knowledge workflows and AI-assisted delivery, with governance and human oversight built around your operating needs.":
    "Nous aidons les organisations à adopter Claude de manière responsable grâce à la conception de cas d'usage concrets, à des intégrations dotées d'autorisations et de points d'approbation, à des flux de connaissances et à une livraison assistée par l'IA, avec une gouvernance et une supervision humaine adaptées à leurs besoins opérationnels.",
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
  "Discuss your Freshworks needs": "Discuter de vos besoins Freshworks",
  "Explore the product fit": "Explorer l'adéquation des produits",
  "Confirmed relationship": "Relation confirmée",
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
  "What Freshworks provides": "Ce que Freshworks fournit",
  "Products for service, support and customer operations": "Des produits pour les services, le support et les opérations client",
  "Platform capabilities, product features, editions and plans are provided and maintained by Freshworks.":
    "Les capacités de la plateforme, les fonctionnalités produit, les éditions et les offres sont fournies et maintenues par Freshworks.",
  "How EquaCore helps": "Comment EquaCore vous accompagne",
  "Process-led implementation and improvement": "Implémentation et amélioration guidées par les processus",
  "Discovery and process mapping, solution and workflow design, configuration, integrations, data migration, user enablement, rollout, ongoing optimisation and support.":
    "Découverte et cartographie des processus, conception de la solution et des flux de travail, configuration, intégrations, migration des données, accompagnement des utilisateurs, déploiement, optimisation continue et support.",
  "Delivery lifecycle": "Cycle de livraison",
  "From process clarity to sustained improvement": "De la clarté des processus à l'amélioration durable",
  "Each stage produces a clear hand-off into the next, with operational learning feeding the improvement backlog.":
    "Chaque étape prépare clairement la suivante, les enseignements opérationnels alimentant le backlog d'amélioration.",
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
  "Discuss Claude adoption": "Discuter de l'adoption de Claude",
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
  "Start with a process and a defined user need, then choose the product surface, knowledge sources, tools and controls that support it.":
    "Partez d'un processus et d'un besoin utilisateur défini, puis choisissez l'interface produit, les sources de connaissances, les outils et les contrôles qui le soutiennent.",
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
  "Introduce repository conventions, permission boundaries, test and review gates, usage guidance and adoption support around engineering work.":
    "Mettez en place des conventions de dépôt, des limites d'autorisation, des contrôles de test et de revue, des consignes d'usage et un accompagnement à l'adoption pour les travaux d'ingénierie.",
  "Product availability, connector behaviour and administrative controls vary by product, plan, permissions and configuration. Fit should be confirmed against current Anthropic documentation and your requirements.":
    "La disponibilité des produits, le comportement des connecteurs et les contrôles d'administration varient selon le produit, l'offre, les autorisations et la configuration. L'adéquation doit être confirmée à partir de la documentation Anthropic à jour et de vos besoins.",
  "Anthropic capability and EquaCore delivery, kept distinct.": "Capacités d'Anthropic et livraison d'EquaCore, clairement distinguées.",
  "Anthropic builds and maintains Claude products and the Claude Platform. EquaCore helps organisations turn an operating need into a governed adoption programme.":
    "Anthropic conçoit et maintient les produits Claude et la Claude Platform. EquaCore aide les organisations à transformer un besoin opérationnel en programme d'adoption gouverné.",
  "What Anthropic provides": "Ce qu'Anthropic fournit",
  "Claude products, platform capabilities and product controls": "Produits Claude, capacités de plateforme et contrôles produit",
  "Models, product experiences, platform features, documentation and vendor-managed controls are provided and maintained by Anthropic.":
    "Les modèles, les expériences produit, les fonctionnalités de plateforme, la documentation et les contrôles gérés par l'éditeur sont fournis et maintenus par Anthropic.",
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
  "Each stage produces evidence for the next decision, with evaluation and operational feedback feeding the improvement backlog.":
    "Chaque étape produit des éléments pour la décision suivante, l'évaluation et les retours opérationnels alimentant le backlog d'amélioration.",
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
  "Discuss an OpenAI use case": "Discuter d'un cas d'usage OpenAI",
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
  "Choose the surface that fits the work.": "Choisissez l'interface adaptée au travail.",
  "OpenAI provides several product surfaces for individual work, organisational knowledge and application workflows. The right choice depends on the users, data, actions and controls involved.":
    "OpenAI propose plusieurs interfaces produit pour le travail individuel, les connaissances de l'organisation et les flux applicatifs. Le bon choix dépend des utilisateurs, des données, des actions et des contrôles concernés.",
  "Workspace adoption": "Adoption de l'espace de travail",
  "ChatGPT workspaces": "Espaces de travail ChatGPT",
  "ChatGPT can support individual and team work within an organisation-managed environment, with available workspace controls and connected sources depending on product and configuration.":
    "ChatGPT peut soutenir le travail individuel et collectif dans un environnement géré par l'organisation, avec des contrôles d'espace de travail et des sources connectées selon le produit et la configuration.",
  "User enablement": "Accompagnement des utilisateurs",
  "Approved knowledge": "Connaissances approuvées",
  "Workspace controls": "Contrôles de l'espace de travail",
  "Application workflows": "Flux applicatifs",
  "Responses API and tool connections": "API Responses et connexions aux outils",
  "The OpenAI API can combine model responses with retrieval, narrowly scoped functions and trusted tool or MCP connections to support application workflows.":
    "L'API OpenAI peut combiner les réponses des modèles avec la recherche, des fonctions à périmètre restreint et des connexions fiables à des outils ou à MCP pour soutenir les flux applicatifs.",
  "Retrieval": "Recherche",
  "Functions and tools": "Fonctions et outils",
  "Approval boundaries": "Limites d'approbation",
  "Knowledge and delivery": "Connaissances et livraison",
  "Source-aware assistance and AI-assisted delivery": "Assistance avec sources et livraison assistée par l'IA",
  "File search can retrieve from approved knowledge bases, while OpenAI coding capabilities can support software delivery within defined repository, test and review practices.":
    "La recherche de fichiers peut extraire des informations de bases de connaissances approuvées, tandis que les capacités de codage d'OpenAI peuvent soutenir la livraison logicielle dans le cadre de pratiques définies de dépôt, de test et de revue.",
  "Knowledge assistants": "Assistants de connaissances",
  "Source visibility": "Visibilité des sources",
  "Test and review gates": "Contrôles de test et de revue",
  "Product availability, data handling, connectors, administrative controls and limits vary by selected OpenAI product, plan, permissions and configuration. Fit should be confirmed against current OpenAI documentation and your requirements.":
    "La disponibilité des produits, le traitement des données, les connecteurs, les contrôles d'administration et les limites varient selon le produit OpenAI, l'offre, les autorisations et la configuration choisis. L'adéquation doit être confirmée à partir de la documentation OpenAI à jour et de vos besoins.",
  "OpenAI products and EquaCore delivery, kept distinct.": "Produits OpenAI et livraison d'EquaCore, clairement distingués.",
  "OpenAI builds and maintains its models, products, APIs and platform controls. EquaCore helps organisations translate a work need into a controlled adoption and integration programme.":
    "OpenAI conçoit et maintient ses modèles, produits, API et contrôles de plateforme. EquaCore aide les organisations à traduire un besoin de travail en programme contrôlé d'adoption et d'intégration.",
  "What OpenAI provides": "Ce qu'OpenAI fournit",
  "Products, models, APIs and product controls": "Produits, modèles, API et contrôles produit",
  "OpenAI provides and maintains the product experiences, model and API capabilities, platform features, documentation and vendor-managed controls.":
    "OpenAI fournit et maintient les expériences produit, les capacités des modèles et des API, les fonctionnalités de plateforme, la documentation et les contrôles gérés par l'éditeur.",
  "Process-led adoption and integration": "Adoption et intégration guidées par les processus",
  "Use-case discovery, workflow and data design, integration configuration, access and approval design, user enablement, operational ownership, evaluation practices and ongoing improvement.":
    "Découverte des cas d'usage, conception des flux et des données, configuration des intégrations, conception des accès et des approbations, accompagnement des utilisateurs, responsabilité opérationnelle, pratiques d'évaluation et amélioration continue.",
  "Practical patterns to explore": "Schémas pratiques à explorer",
  "Start with a real workflow, not a generic AI promise.": "Partez d'un flux réel, pas d'une promesse générique sur l'IA.",
  "These patterns are starting points for discovery. Each needs its own data, permission, quality and operating assessment.":
    "Ces schémas sont des points de départ pour la découverte. Chacun nécessite sa propre évaluation des données, des autorisations, de la qualité et du fonctionnement.",
  "Source-aware knowledge support": "Support des connaissances avec sources",
  "Help people find and synthesise information from approved sources, with source references and clear ownership for the underlying knowledge.":
    "Aidez les personnes à trouver et synthétiser des informations provenant de sources approuvées, avec des références et une responsabilité claire pour les connaissances sous-jacentes.",
  "Governed workflow support": "Support de flux gouverné",
  "Use narrowly scoped tools or functions to prepare work, recommend next steps or support actions, with approval before consequential side effects.":
    "Utilisez des outils ou fonctions à périmètre restreint pour préparer le travail, recommander les prochaines étapes ou soutenir des actions, avec approbation avant tout effet à conséquence.",
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
  "Each stage produces a decision or artefact for the next, so adoption can progress with evidence and clear ownership.":
    "Chaque étape produit une décision ou un livrable pour la suivante, afin que l'adoption progresse avec des éléments probants et une responsabilité claire.",
  "Discover the work": "Découvrir le travail",
  "Map users, tasks, pain points and decide whether AI is an appropriate fit.": "Cartographiez les utilisateurs, les tâches et les difficultés, puis déterminez si l'IA est adaptée.",
  "Design the boundaries": "Concevoir les limites",
  "Define data, access, tool, approval, failure and ownership requirements.": "Définissez les exigences relatives aux données, aux accès, aux outils, aux approbations, aux échecs et aux responsabilités.",
  "Build and connect": "Construire et connecter",
  "Configure the workspace or application workflow and its approved connections.": "Configurez l'espace de travail ou le flux applicatif et ses connexions approuvées.",
  "Validate and approve": "Valider et approuver",
  "Test representative work, review failures and confirm readiness with accountable owners.": "Testez des travaux représentatifs, examinez les échecs et confirmez la préparation avec les responsables désignés.",
  "Enable and improve": "Accompagner et améliorer",
  "Support adoption, monitor operation and prioritise changes from real evidence.": "Soutenez l'adoption, surveillez le fonctionnement et priorisez les changements à partir d'éléments réels.",
  "Where could OpenAI improve the way work gets done?": "Où OpenAI pourrait-il améliorer la manière dont le travail est réalisé ?",
  "Bring the process, knowledge challenge or delivery workflow. We will help assess the fit and frame a controlled adoption path.":
    "Présentez-nous le processus, le défi de connaissances ou le flux de livraison. Nous vous aiderons à évaluer l'adéquation et à cadrer un parcours d'adoption contrôlé.",
  "Start a conversation": "Démarrer une conversation",
  "Explore all services": "Découvrir tous les services",

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
  "Anthropic Partner": "Partenaire Anthropic",
  "OpenAI Partner": "Partenaire OpenAI",
  "ServiceNow® Ecosystem Practice — Independent": "Pratique de l'écosystème ServiceNow® — indépendante",

  // ---- Core Offerings ----
  "Core Offerings": "Nos offres principales",
  "Technology services, delivered right": "Des services technologiques, livrés comme il se doit",
  "Our platform services, talent offering, and technology partnerships — brought together with clear scope and disciplined delivery.":
    "Nos services de plateforme, notre offre de talents et nos partenariats technologiques — réunis autour d'un périmètre clair et d'une livraison rigoureuse.",
  "Full Halo partner — delivering HaloITSM, HaloPSA, and HaloCRM across full-lifecycle implementations, migrations, process alignment, and managed support.":
    "Partenaire Halo à part entière — nous livrons HaloITSM, HaloPSA et HaloCRM, de l'implémentation de bout en bout aux migrations, à l'alignement des processus et au support géré.",
  "Explore Halo Services →": "Découvrir les services Halo →",
  "HaloITSM — IT & Enterprise Service Management": "HaloITSM — gestion des services IT et d'entreprise",
  "HaloPSA — MSP & Professional Services Automation": "HaloPSA — automatisation pour MSP et services professionnels",
  "HaloCRM — Omnichannel Sales & Customer Service": "HaloCRM — ventes et service client omnicanal",
  "Legacy tool migration & process alignment": "Migration d'outils existants et alignement des processus",
  "User onboarding & post-go-live managed support": "Prise en main utilisateurs et support géré après mise en service",
  "Pre-vetted ServiceNow talent for placement and embedded teams, ongoing managed operations, and independent platform advisory — supporting organisations using the ServiceNow® platform.":
    "Des talents ServiceNow présélectionnés pour le placement et les équipes intégrées, des opérations managées en continu et un conseil plateforme indépendant — au service des organisations qui utilisent la plateforme ServiceNow®.",
  "Explore ServiceNow →": "Découvrir ServiceNow →",
  "Talent placement & embedded teams": "Placement de talents et équipes intégrées",
  "Managed services & ongoing operations": "Services gérés et opérations managées en continu",
  "Independent advisory & health checks": "Conseil indépendant et bilans de santé plateforme",
  "Process design aligned to ITIL": "Conception de processus alignée sur ITIL",
  "Our ServiceNow® services remain independent. We are an Anthropic Partner and an OpenAI Partner, alongside our full Halo Technology Alliance Partner status.":
    "Nos services ServiceNow® restent indépendants. Nous sommes partenaire d'Anthropic et partenaire d'OpenAI, aux côtés de notre statut de partenaire à part entière du Halo Technology Alliance.",
  "Our ServiceNow® services remain independent. We are a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner.":
    "Nos services ServiceNow® restent indépendants. Nous sommes partenaire à part entière du Halo Technology Alliance, partenaire Freshworks, partenaire Anthropic et partenaire OpenAI.",
  "View Our Partnerships →": "Voir nos partenariats →",
  "Independent ServiceNow® services": "Services ServiceNow® indépendants",
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
  "EquaCore Digital helps organisations improve service delivery, simplify workflows and embed sustainable digital operations. From our Nigeria base, we deliver platform implementation and improvement across Halo and Freshworks solutions, independent ServiceNow advisory and ongoing managed operations, and specialist talent for embedded delivery teams. Our relationships as a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner support practical delivery across service management, customer operations and responsible AI. We combine process design, platform delivery, user enablement and knowledge transfer for organisations in the UK, Europe and West Africa.":
    "EquaCore Digital aide les organisations à améliorer la prestation de services, à simplifier les flux de travail et à ancrer des opérations numériques durables. Depuis notre base au Nigeria, nous assurons l'implémentation et l'amélioration de plateformes couvrant les solutions Halo et Freshworks, le conseil ServiceNow indépendant et les opérations managées en continu, ainsi que des talents spécialisés pour les équipes de livraison intégrées. Nos relations en tant que partenaire à part entière du Halo Technology Alliance, partenaire Freshworks, partenaire Anthropic et partenaire OpenAI soutiennent une livraison pratique dans la gestion des services, les opérations client et l'IA responsable. Nous associons conception des processus, livraison de plateformes, accompagnement des utilisateurs et transfert de compétences pour des organisations au Royaume-Uni, en Europe et en Afrique de l'Ouest.",
  "EquaCore Digital is a ServiceNow consulting and full Halo platform partner headquartered in Nigeria and operating globally. We provide ServiceNow talent augmentation — placing pre-vetted administrators, developers, and architects with enterprise clients — alongside ongoing managed operations and independent advisory. As a full Halo Technology Alliance Partner, we are authorised to deliver end-to-end implementations of HaloITSM (IT and Enterprise Service Management), HaloPSA (Professional Services Automation for MSPs), and HaloCRM (omnichannel CRM). Our delivery model combines African technology talent with structured governance frameworks, enabling organisations across the UK, Europe, and West Africa to modernise their service operations with confidence.":
    "EquaCore Digital est un cabinet de conseil ServiceNow et partenaire Halo à part entière, basé au Nigeria et actif dans le monde entier. Nous proposons du renfort de talents ServiceNow — en plaçant des administrateurs, développeurs et architectes présélectionnés auprès de clients grands comptes —, ainsi que des opérations managées en continu et un conseil indépendant. En tant que partenaire à part entière du Halo Technology Alliance, nous sommes habilités à livrer des implémentations complètes de HaloITSM (gestion des services IT et d'entreprise), HaloPSA (automatisation des services professionnels pour MSP) et HaloCRM (CRM omnicanal). Notre modèle de livraison associe des talents technologiques africains à des cadres de gouvernance structurés, permettant aux organisations du Royaume-Uni, d'Europe et d'Afrique de l'Ouest de moderniser leurs opérations de service en toute confiance.",

  // ---- FAQ ----
  "FAQ": "FAQ",
  "Frequently Asked Questions": "Questions fréquentes",
  "What does EquaCore Digital do?": "Que fait EquaCore Digital ?",
  "EquaCore Digital helps organisations improve service delivery and digital operations. We provide platform implementation and improvement across Halo and Freshworks solutions, independent ServiceNow advisory and ongoing managed operations, specialist talent, and responsible AI delivery. EquaCore is a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner.":
    "EquaCore Digital aide les organisations à améliorer la prestation de services et leurs opérations numériques. Nous assurons l'implémentation et l'amélioration de plateformes couvrant les solutions Halo et Freshworks, le conseil ServiceNow indépendant et les opérations managées en continu, des talents spécialisés et une livraison responsable de solutions d'IA. EquaCore est partenaire à part entière du Halo Technology Alliance, partenaire Freshworks, partenaire Anthropic et partenaire OpenAI.",
  "EquaCore Digital is a technology services firm specialising in ServiceNow and the full Halo platform. We provide talent augmentation (placing pre-vetted ServiceNow professionals with global enterprises), ongoing managed operations, and independent advisory — plus full implementations of HaloITSM, HaloPSA, and HaloCRM as a full Halo Technology Alliance Partner. EquaCore Digital is also an Anthropic Partner and an OpenAI Partner.":
    "EquaCore Digital est un cabinet de services technologiques spécialisé dans ServiceNow et l'ensemble de la plateforme Halo. Nous proposons du renfort de talents (placement de professionnels ServiceNow présélectionnés auprès d'entreprises internationales), des opérations managées en continu et du conseil indépendant — ainsi que des implémentations complètes de HaloITSM, HaloPSA et HaloCRM en tant que partenaire à part entière du Halo Technology Alliance. EquaCore Digital est également partenaire d'Anthropic et partenaire d'OpenAI.",
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
  "A quick scan of EquaCore's platform services, talent offering, and technology partnerships. Our ServiceNow® services remain independent.":
    "Un aperçu des services de plateforme, de l'offre de talents et des partenariats technologiques d'EquaCore. Nos services ServiceNow® restent indépendants.",
  "Full Halo partner delivering HaloITSM, HaloPSA, and HaloCRM — implementation, legacy migration, process alignment, and ongoing managed support across all three products.":
    "Partenaire Halo à part entière livrant HaloITSM, HaloPSA et HaloCRM — implémentation, migration d'outils existants, alignement des processus et support géré continu sur les trois produits.",
  "ServiceNow Services": "Services ServiceNow",
  "Pre-vetted ServiceNow talent for placement and embedded teams, ongoing managed operations, and independent platform advisory. Supporting organisations using the ServiceNow® platform.":
    "Des talents ServiceNow présélectionnés pour le placement et les équipes intégrées, des opérations managées en continu et un conseil plateforme indépendant, au service des organisations qui utilisent la plateforme ServiceNow®.",
  "Pre-vetted Nigerian ServiceNow professionals ready for global enterprise delivery, with flexible engagement structures.":
    "Des professionnels ServiceNow nigérians présélectionnés, prêts pour une livraison en entreprise à l'international, avec des formats d'engagement flexibles.",

  // ---- ServiceNow page ----
  "ServiceNow Talent & Managed Services in Nigeria": "Talents ServiceNow et services gérés au Nigeria",
  "Nigeria-based ServiceNow specialists — pre-vetted talent, hands-on managed operations, and independent advisory for organisations using the ServiceNow® platform in Nigeria and worldwide.":
    "Des spécialistes ServiceNow basés au Nigeria — talents présélectionnés, exploitation gérée sur le terrain et conseil indépendant pour les organisations qui utilisent la plateforme ServiceNow® au Nigeria et dans le monde.",
  "ServiceNow in Nigeria": "ServiceNow au Nigeria",
  "ServiceNow Consulting & Talent in Nigeria": "Conseil et talents ServiceNow au Nigeria",
  "EquaCore Digital is a Nigeria-based ServiceNow advisory firm headquartered in Lagos. We help organisations in Nigeria and across West Africa adopt, deploy, and operate the ServiceNow® platform — through pre-vetted talent, ongoing managed operations, and independent advisory, with delivery that extends to clients in the UK, Europe, and beyond.":
    "EquaCore Digital est un cabinet de conseil ServiceNow basé au Nigeria, dont le siège est à Lagos. Nous aidons les organisations du Nigeria et d'Afrique de l'Ouest à adopter, déployer et exploiter la plateforme ServiceNow® — grâce à des talents présélectionnés, des opérations managées en continu et un conseil indépendant, avec une livraison qui s'étend à des clients au Royaume-Uni, en Europe et au-delà.",
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
  "Ongoing managed operations keep your platform healthy as your organisation grows. Our team handles routine administration, incident response, and continuous tuning — with clear SLAs, transparent reporting, and predictable retainers.":
    "Des opérations managées en continu qui maintiennent votre plateforme en bonne santé à mesure que votre organisation grandit. Notre équipe assure l'administration courante, la réponse aux incidents et l'optimisation continue — avec des SLA clairs, un reporting transparent et des forfaits prévisibles.",
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
  "Partnerships": "Partenariats",
  "Technology Partnerships": "Partenariats technologiques",
  "EquaCore Digital is an Anthropic Partner and an OpenAI Partner, alongside our full Halo Technology Alliance Partner status. These relationships sit alongside our work in Talent, Managed Services, and Advisory. Our ServiceNow® services are independent.":
    "EquaCore Digital est partenaire d'Anthropic et partenaire d'OpenAI, aux côtés de notre statut de partenaire à part entière du Halo Technology Alliance. Ces relations accompagnent notre travail dans les domaines des talents, des services gérés et du conseil. Nos services ServiceNow® sont indépendants.",
  "EquaCore Digital is a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner. These relationships sit alongside our work in Talent, Managed Services, and Advisory. Our ServiceNow® services are independent.":
    "EquaCore Digital est partenaire à part entière du Halo Technology Alliance, partenaire Freshworks, partenaire Anthropic et partenaire OpenAI. Ces relations complètent nos activités dans les domaines des talents, des services gérés et du conseil. Nos services ServiceNow® sont indépendants.",

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
  "Freshworks Services & Implementation — EquaCore Digital": "Services et implémentation Freshworks — EquaCore Digital",
  "Responsible Claude Adoption — EquaCore Digital": "Adoption responsable de Claude — EquaCore Digital",
  "OpenAI Adoption & Integration — EquaCore Digital": "Adoption et intégration d'OpenAI — EquaCore Digital",
  "Talent Augmentation — EquaCore Digital": "Renfort de talents — EquaCore Digital",
  "Join Our Talent Pool — EquaCore Digital": "Rejoindre notre vivier de talents — EquaCore Digital",
  "Engagement Models — EquaCore Digital": "Modèles d'engagement — EquaCore Digital",
  "About — EquaCore Digital": "À propos — EquaCore Digital",
  "Markets Served — EquaCore Digital": "Marchés desservis — EquaCore Digital",
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
  "EquaCore Digital is an Anthropic Partner and an OpenAI Partner, alongside full Halo platform delivery and independent ServiceNow services. Based in Nigeria, delivering globally.":
    "EquaCore Digital est partenaire d'Anthropic et partenaire d'OpenAI, aux côtés de la livraison de la plateforme Halo complète et de services ServiceNow indépendants. Basé au Nigeria, actif dans le monde entier.",
  "EquaCore Digital offers Halo platform delivery, independent ServiceNow services and talent, and is a Full Halo Technology Alliance Partner, Freshworks Partner, Anthropic Partner and OpenAI Partner.":
    "EquaCore Digital propose la livraison de la plateforme Halo, des services ServiceNow indépendants et des talents, et est partenaire à part entière du Halo Technology Alliance, partenaire de Freshworks, partenaire d'Anthropic et partenaire d'OpenAI.",
  "EquaCore Digital's offering includes full Halo platform delivery, independent ServiceNow services, talent augmentation, plus its Anthropic Partner and OpenAI Partner status.":
    "L'offre d'EquaCore Digital comprend la livraison complète de la plateforme Halo, des services ServiceNow indépendants, le renfort de talents, ainsi que ses statuts de partenaire d'Anthropic et d'OpenAI.",
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
  "EquaCore Digital is an Anthropic Partner, an OpenAI Partner, and a full Halo Technology Alliance Partner, with independent ServiceNow services and global delivery.":
    "EquaCore Digital est partenaire d'Anthropic, partenaire d'OpenAI et partenaire à part entière du Halo Technology Alliance, avec des services ServiceNow indépendants et une livraison mondiale.",
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
  "Core offerings at a glance": "Aperçu des offres principales",
  "Processes, platforms and people converge in EquaCore's digital improvement delivery model": "Les processus, les plateformes et les personnes convergent dans le modèle d'amélioration numérique d'EquaCore",
  "Halo and Freshworks solutions feed an improvement journey from discovery and design through implementation and continuous optimisation.": "Les solutions Halo et Freshworks alimentent un parcours d'amélioration allant de la découverte et de la conception jusqu'à l'implémentation et à l'optimisation continue.",
  "Service requests move through an independent ServiceNow operations cycle of assessment, operation, advice and improvement, with resolved work feeding future improvement.": "Les demandes de service suivent un cycle d'exploitation ServiceNow indépendant comprenant l'évaluation, l'exploitation, le conseil et l'amélioration, les travaux résolus alimentant les améliorations futures.",
  "Distinct specialist profiles progress through technical assessment and structured development before joining an embedded enterprise delivery team.": "Des profils spécialistes distincts passent par une évaluation technique et un développement structuré avant de rejoindre une équipe de livraison intégrée à l'entreprise.",
  "A five-stage Freshworks delivery journey maps processes, designs the solution, configures workflows, enables users and feeds operational learning into continuous improvement.": "Un parcours de livraison Freshworks en cinq étapes cartographie les processus, conçoit la solution, configure les flux de travail, accompagne les utilisateurs et transforme les enseignements opérationnels en amélioration continue.",
  "Work, knowledge and people move through a five-stage Claude adoption journey of discovery, prioritisation, connection, governance and improvement, with human review and evaluation built into the cycle.": "Le travail, les connaissances et les personnes suivent un parcours d'adoption de Claude en cinq étapes — découverte, priorisation, connexion, gouvernance et amélioration — avec validation humaine et évaluation intégrées au cycle.",
  "People, approved knowledge and systems move through ChatGPT workspace and API tool rails into an owned operational workflow, with human approval before assistance or action and learning feeding continuous improvement.": "Les personnes, les connaissances approuvées et les systèmes passent par les voies de l'espace de travail ChatGPT et des outils API vers un flux opérationnel maîtrisé, avec validation humaine avant l'assistance ou l'action et des enseignements qui alimentent l'amélioration continue.",
  "Halo platform delivery, independent ServiceNow services and talent augmentation converge in EquaCore's delivery model": "La livraison de la plateforme Halo, les services ServiceNow indépendants et le renfort de talents convergent dans le modèle de livraison d'EquaCore",
  "Three service channels labelled HaloITSM, HaloPSA and HaloCRM flow into a shared implementation and support workspace.": "Trois canaux de service nommés HaloITSM, HaloPSA et HaloCRM convergent vers un espace commun d'implémentation et de support.",
  "Health assessment, managed operations and advisory connect to an independently supported ServiceNow platform workspace.": "L'évaluation de santé, l'exploitation gérée et le conseil se connectent à un espace de travail de la plateforme ServiceNow pris en charge de manière indépendante.",
  "Three assessed professional profiles move through mentorship into an embedded enterprise delivery team.": "Trois profils professionnels évalués passent par le mentorat avant d'intégrer une équipe de livraison d'entreprise.",
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
  // The Anthropic and OpenAI process graphics contain meaningful labels.
  // Translate only those curated SVG nodes; other inline SVGs are icons.
  document.querySelectorAll('.an-process-svg text,.an-process-svg title,.an-process-svg desc,.oa-process-svg text,.oa-process-svg title,.oa-process-svg desc').forEach(el => {
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
