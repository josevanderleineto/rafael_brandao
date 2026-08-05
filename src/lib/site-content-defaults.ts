// ─── Shared types and defaults (no server-only — can be imported by client components) ───

export type SiteContent = Record<string, string>;

export const defaultSiteContent: SiteContent = {
  // Hero
  "hero.eyebrow": "Corretor de Imóveis · Soluções Imobiliárias na Bahia",
  "hero.title": "Segurança para o seu imóvel. Tranquilidade para a sua vida.",
  "hero.titleHighlight": "Tranquilidade",
  "hero.subtitle":
    "Administração, locação, vendas, avaliações e assessoria documental conduzidas com ética, transparência e atenção a cada detalhe.",
  "hero.bgImage": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
  "hero.cta1": "Ver Imóveis Disponíveis",
  "hero.cta2": "Falar com o Corretor",
  "hero.tag1": "🔑 Locação",
  "hero.tag2": "🏠 Vendas",
  "hero.tag3": "🏢 Administração",
  "hero.tag4": "📋 Avaliações & Regularização",

  // About
  "about.eyebrow": "Nossa Atuação",
  "about.title": "Experiência que protege o seu patrimônio",
  "about.paragraph1":
    "Com mais de 25 anos de experiência no mercado imobiliário, oferecemos um atendimento pautado pela ética, transparência e compromisso com cada cliente. Cada negociação é conduzida com sigilo, discrição e segurança.",
  "about.paragraph2":
    "Somos especialistas em locação e administração de imóveis, avaliação mercadológica, regularização documental e intermediação de terrenos para incorporação em Salvador, Região Metropolitana e Litoral Norte da Bahia.",
  "about.creci": "CRECI-BA 7691",
  "about.cnai": "CNAI 47.907 · Avaliador de Imóveis",
  "about.cnaiRegion": "Salvador · Região Metropolitana · Litoral Norte da Bahia",
  "about.photo": "/rafael-brandao.jpg",

  // Stats (About section)
  "about.stat1.value": "25+",
  "about.stat1.label": "anos de experiência",
  "about.stat2.value": "100%",
  "about.stat2.label": "sigilo e discrição",

  // Services
  "services.eyebrow": "Soluções Completas",
  "services.title": "Uma assessoria imobiliária pensada para decisões seguras.",
  "services.titleHighlight": "decisões seguras.",
  "services.subtitle":
    "Do primeiro contato à manutenção do imóvel, nossa equipe trabalha para simplificar cada etapa.",
  "services.card1.title": "Locação e administração",
  "services.card1.text":
    "Gestão profissional para valorizar o patrimônio e trazer tranquilidade a proprietários e locatários.",
  "services.card2.title": "Terrenos para incorporação",
  "services.card2.text":
    "Oportunidades estratégicas e negociações confidenciais para investidores, incorporadoras e proprietários.",
  "services.card3.title": "Avaliações e regularização",
  "services.card3.text":
    "Laudos técnicos e assessoria em documentos, escrituras e processos imobiliários.",
  "services.card4.title": "Vendas e consultoria",
  "services.card4.text":
    "Intermediação segura, análise de mercado e atendimento personalizado em todas as etapas.",
  // Video in Services (optional)
  "services.video": "",
  "services.video.title": "Conheça nosso trabalho",
  "services.video.subtitle": "Assista e veja como atuamos com excelência no mercado imobiliário da Bahia.",

  // Footer
  "footer.instagram": "https://instagram.com",
  "footer.linkedin": "https://linkedin.com",
  "footer.copyright": "© 2026 Rafael Brandão · Desenvolvimento Imobiliário. Todos os direitos reservados.",
};
