import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function App() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [videoLoading, setVideoLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    fleetSize: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });
  const [activeFAQ, setActiveFAQ] = useState(null);

  const handleVideoTabChange = (index) => {
    setCurrentVideo(index);
    setVideoLoading(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({
      submitted: true,
      success: false,
      message: 'Envoi en cours...'
    });

    // Simulate API call
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Merci ! Nous vous contacterons dans les 24h pour organiser votre démo personnalisée.'
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        fleetSize: ''
      });
    }, 2000);
  };

  const handleDemoRequest = () => {
    const subject = encodeURIComponent('Demande de démo Vehitrack');
    const body = encodeURIComponent(`Bonjour,

Je souhaite demander une démo de Vehitrack pour ma société.

Informations :
- Nom : [Votre nom]
- Email : [Votre email]
- Société : [Nom de votre société]
- Taille de flotte : [Nombre de véhicules]

Pouvez-vous me contacter pour organiser une démo personnalisée ?

Cordialement,
[Votre nom]`);

    const mailtoLink = `mailto:bslreda26@hotmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };



  const faqData = [
    {
      question: "Combien de temps faut-il pour configurer Vehitrack ?",
      answer: "La configuration de base prend moins de 5 minutes. Notre équipe vous accompagne pour une mise en place complète en 1-2 jours selon la taille de votre flotte."
    },
    {
      question: "Puis-je essayer Vehitrack gratuitement ?",
      answer: "Oui ! Nous offrons un essai gratuit de 30 jours sans engagement. Vous avez accès à toutes les fonctionnalités pendant cette période."
    },

    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Vos données sont hébergées sur des serveurs sécurisés avec chiffrement SSL. Nous respectons le RGPD et ne partageons jamais vos informations."
    },
    {
      question: "Puis-je intégrer Vehitrack avec mes outils existants ?",
      answer: "Oui, Vehitrack propose des API et des intégrations avec les principaux outils de gestion d'entreprise, comptabilité et GPS."
    },
    {
      question: "Quel type de support proposez-vous ?",
      answer: "Nous offrons un support multilingue par email, chat et téléphone. Les clients Enterprise bénéficient d'un support dédié 24/7."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      {/* Navigation */}
      <motion.nav 
        className="flex justify-between items-center py-6 px-8 lg:px-16 bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200 shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          Vehitrack
        </motion.div>
        <motion.div className="hidden md:flex gap-8">
          <motion.a 
            href="#features" 
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            whileHover={{ y: -2 }}
          >
            Fonctionnalités
          </motion.a>

          <motion.a 
            href="#faq" 
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            whileHover={{ y: -2 }}
          >
            FAQ
          </motion.a>
          <motion.a 
            href="#contact" 
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            whileHover={{ y: -2 }}
          >
            Contact
          </motion.a>
        </motion.div>
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4 md:px-8 lg:px-16">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-200/50 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-200/50 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium mb-8 border border-blue-200"
              variants={fadeInUp}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Solution de gestion de flotte intelligente
            </motion.div>
            
            <motion.h1 
              className="text-6xl lg:text-8xl font-bold mb-8 text-gray-900 leading-tight"
              variants={fadeInUp}
            >
              Gérez votre flotte{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                intelligemment
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl mb-12 text-gray-600 leading-relaxed max-w-4xl mx-auto"
              variants={fadeInUp}
            >
              Simplifiez la gestion de vos véhicules, documents et dépenses avec une solution tout-en-un moderne et intuitive.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              variants={fadeInUp}
            >
              <motion.button 
                onClick={handleDemoRequest}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Demander une démo</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              
              <motion.button 
                className="border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                En savoir plus
              </motion.button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="flex justify-center gap-12 mt-16"
              variants={fadeInUp}
            >
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600">Véhicules gérés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">10+</div>
                <div className="text-sm text-gray-600">Entreprises</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">99%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 md:px-8 lg:px-16 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <motion.div className="text-center mb-20" variants={fadeInUp}>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
              Fonctionnalités{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                innovantes
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les outils qui révolutionnent la gestion de flotte
            </p>
          </motion.div>
          
          <motion.div 
            className="space-y-16"
            variants={staggerContainer}
          >
            {/* Video Showcase Container */}
            <motion.div 
              className="bg-gradient-to-br from-gray-50 to-blue-50 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
              variants={scaleIn}
            >
              {/* Video Navigation Tabs */}
              <div className="bg-gradient-to-r from-gray-100 to-blue-100 p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    {
                      icon: "📊",
                      title: "Tableau de bord",
                      description: "Accédez à toutes vos données facilement avec un dashboard personnalisable et en temps réel.",
                      gradient: "from-orange-500 to-red-500",
                      video: "/vehitrack-landing/videos/dashboard.mp4"
                    },
                    {
                      icon: "💰",
                      title: "Suivi des dépenses",
                      description: "Visualisez et analysez vos dépenses avec des graphiques interactifs et des rapports détaillés.",
                      gradient: "from-green-500 to-emerald-500",
                      video: "/vehitrack-landing/videos/depence.mp4"
                    },
                    {
                      icon: "📄",
                      title: "Gestion des documents",
                      description: "Organisez et suivez tous vos documents importants avec des alertes d'expiration automatiques.",
                      gradient: "from-purple-500 to-pink-500",
                      video: "/vehitrack-landing/videos/documents.mp4"
                    },
                    {
                      icon: "🚗",
                      title: "Gestion des véhicules",
                      description: "Gérez facilement vos véhicules avec une interface intuitive pour ajouter, modifier et suivre tous vos véhicules.",
                      gradient: "from-blue-500 to-cyan-500",
                      video: "/vehitrack-landing/videos/vehicule.mp4"
                    },
                    {
                      icon: "👥",
                      title: "Utilisateurs et paramètres",
                      description: "Ajoutez et gérez facilement les utilisateurs avec des permissions granulaires et sécurisées.",
                      gradient: "from-indigo-500 to-blue-500",
                      video: "/vehitrack-landing/videos/utilisateur et parametre.mp4"
                    }
                  ].map((feature, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleVideoTabChange(index)}
                      className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        currentVideo === index
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-white/80 text-gray-700 hover:bg-white hover:text-blue-600 border border-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={videoLoading}
                    >
                      <span className="text-xl">{feature.icon}</span>
                      <span className="hidden sm:inline text-sm">{feature.title}</span>
                      {videoLoading && currentVideo === index && (
                        <svg className="animate-spin h-5 w-5 text-white ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Video Display Area */}
              <div className="p-8 lg:p-12">
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${
                      [
                        "from-orange-500 to-red-500",
                        "from-green-500 to-emerald-500",
                        "from-purple-500 to-pink-500", 
                        "from-blue-500 to-cyan-500",
                        "from-indigo-500 to-blue-500"
                      ][currentVideo]
                    } flex items-center justify-center text-3xl mr-8`}>
                      {[
                        "📊", "💰", "📄", "🚗", "👥"
                      ][currentVideo]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        {[
                          "Tableau de bord",
                          "Suivi des dépenses",
                          "Gestion des documents", 
                          "Gestion des véhicules",
                          "Utilisateurs et paramètres"
                        ][currentVideo]}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed max-w-4xl">
                        {[
                          "Accédez à toutes vos données facilement avec un dashboard personnalisable et en temps réel.",
                          "Visualisez et analysez vos dépenses avec des graphiques interactifs et des rapports détaillés.",
                          "Organisez et suivez tous vos documents importants avec des alertes d'expiration automatiques.",
                          "Gérez facilement vos véhicules avec une interface intuitive pour ajouter, modifier et suivre tous vos véhicules.",
                          "Ajoutez et gérez facilement les utilisateurs avec des permissions granulaires et sécurisées."
                        ][currentVideo]}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden" style={{ aspectRatio: '16/10' }}>
                  {videoLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                      <div className="text-white text-center">
                        <svg className="animate-spin h-16 w-16 text-white mx-auto mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-lg">Chargement de la vidéo...</p>
                      </div>
                    </div>
                  )}
                  <video 
                    key={currentVideo}
                    className="w-full h-full object-contain"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    controls={false}
                    disablePictureInPicture={true}
                    disableRemotePlayback={true}
                    onLoadedData={() => {
                      console.log(`Video ${currentVideo} loaded`);
                      setVideoLoading(false);
                    }}
                    onError={(e) => {
                      console.error(`Error loading video ${currentVideo}:`, e);
                      setVideoLoading(false);
                    }}
                    onLoadStart={() => setVideoLoading(true)}
                  >
                    <source src={[
                      "/vehitrack-landing/videos/dashboard.mp4",
                      "/vehitrack-landing/videos/depence.mp4",
                      "/vehitrack-landing/videos/documents.mp4",
                      "/vehitrack-landing/videos/vehicule.mp4",
                      "/vehitrack-landing/videos/utilisateur et parametre.mp4"
                    ][currentVideo]} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>
                
                {/* Video controls info */}
                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-lg">
                    Cliquez sur les onglets ci-dessus pour voir les différentes fonctionnalités
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>



      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6 md:px-8 lg:px-16 bg-white">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <motion.div className="text-center mb-20" variants={fadeInUp}>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
              Questions{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                fréquentes
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur Vehitrack
            </p>
          </motion.div>
          
          <motion.div className="space-y-4" variants={staggerContainer}>
            {faqData.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 overflow-hidden"
                variants={fadeInUp}
              >
                <motion.button
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  <motion.svg
                    className="w-6 h-6 text-gray-500 flex-shrink-0"
                    animate={{ rotate: activeFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>
                
                <motion.div
                  className="overflow-hidden"
                  initial={false}
                  animate={{ height: activeFAQ === index ? 'auto' : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-32 px-6 md:px-8 lg:px-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        </div>
        
        <motion.div 
          className="max-w-7xl mx-auto relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-4xl lg:text-6xl font-bold mb-8">
                Prêt à optimiser la gestion de votre flotte ?
              </h2>
              <p className="text-xl mb-10 text-blue-100 leading-relaxed">
                Demandez une démo personnalisée et découvrez comment Vehitrack peut transformer votre gestion de flotte en quelques minutes.
              </p>
              
              <motion.div className="space-y-4 mb-10" variants={staggerContainer}>
                {[
                  "Installation rapide en 5 minutes",
                  "Support dédié 24/7",
                  "30 jours d'essai gratuit",
                  "Formation personnalisée incluse"
                ].map((benefit, index) => (
                  <motion.div key={index} className="flex items-center" variants={fadeInUp}>
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={scaleIn}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
            >
              <h3 className="text-2xl font-bold mb-8 text-center">Demandez une démo</h3>
              
              {formStatus.submitted && (
                <motion.div 
                  className={`p-4 rounded-xl mb-6 ${
                    formStatus.success 
                      ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                      : 'bg-red-500/20 text-red-100 border border-red-400/30'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formStatus.message}
                </motion.div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nom complet"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 backdrop-blur-sm"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
                
                <div>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email professionnel"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 backdrop-blur-sm"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
                
                <div>
                  <motion.input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Société"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white placeholder-white/70 backdrop-blur-sm"
                    whileFocus={{ scale: 1.02 }}
                    required
                  />
                </div>
                
                <div>
                  <motion.select
                    name="fleetSize"
                    value={formData.fleetSize}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 text-white backdrop-blur-sm"
                    whileFocus={{ scale: 1.02 }}
                  >
                    <option value="" disabled className="text-gray-800">Taille de votre flotte</option>
                    <option value="small" className="text-gray-800">1-10 véhicules</option>
                    <option value="medium" className="text-gray-800">11-50 véhicules</option>
                    <option value="large" className="text-gray-800">51-200 véhicules</option>
                    <option value="enterprise" className="text-gray-800">200+ véhicules</option>
                  </motion.select>
                </div>
                
                <motion.button 
                  type="submit"
                  className="w-full bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formStatus.submitted && !formStatus.success}
                >
                  {formStatus.submitted && !formStatus.success ? 'Envoi en cours...' : 'Demander ma démo'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 py-16 px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <motion.h3 
                className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ x: 2 }}
              >
                Vehitrack
              </motion.h3>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                La solution intelligente pour la gestion de votre flotte de véhicules. 
                Simplifiez, optimisez et sécurisez votre gestion de flotte.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-6 text-gray-900">Contact</h4>
              <div className="space-y-4 text-gray-600">
                <motion.div className="flex items-center" whileHover={{ x: 2 }}>
                  <span className="mr-3">📧</span>
                  <span>bslreda26@hotmail.com</span>
                </motion.div>
                <motion.div className="flex items-center" whileHover={{ x: 2 }}>
                  <span className="mr-3">📞</span>
                  <span>+225 07 02 60 43 09</span>
                </motion.div>
                <motion.div className="flex items-center" whileHover={{ x: 2 }}>
                  <span className="mr-3">📍</span>
                  <span>Abidjan, Côte d'Ivoire</span>
                </motion.div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-8 text-center">
            <p className="text-gray-500">
              © Vehitrack 2025 — Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
