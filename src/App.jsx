import React, { useState, useEffect } from "react";
// Make sure framer-motion is properly imported
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Form state
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
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.company) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Veuillez remplir tous les champs obligatoires.'
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Veuillez entrer une adresse email valide.'
      });
      return;
    }
    
    // Simulate API call success
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Votre demande a été envoyée avec succès! Nous vous contacterons bientôt.'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        company: '',
        fleetSize: ''
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          success: false,
          message: ''
        });
      }, 5000);
    }, 1500);
  };
  
  // Image carousel states
  const [currentDashboardImage, setCurrentDashboardImage] = useState(0);
  const [currentVehiclesImage, setCurrentVehiclesImage] = useState(0);
  const [currentAlertsImage, setCurrentAlertsImage] = useState(0);
  const [currentExpensesImage, setCurrentExpensesImage] = useState(0);
  const [currentAnalyticsImage, setCurrentAnalyticsImage] = useState(0);
  
  // All images in numerical order
  const orderedImages = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
    '/images/6.png',
    '/images/7.png',
    '/images/8.png'
  ];
  
  // Dashboard carousel images - using all images in order
  const dashboardImages = orderedImages;
  
  // Feature section images - using subsets of the ordered images
  const vehiclesImages = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png'
  ];
  
  const alertsImages = [
    '/images/4.png',
    '/images/5.png',
    '/images/6.png'
  ];
  
  const expensesImages = [
    '/images/6.png',
    '/images/7.png',
    '/images/8.png'
  ];
  
  const analyticsImages = [
    '/images/2.png',
    '/images/4.png',
    '/images/8.png'
  ];
  
  // Image rotation effect
  useEffect(() => {
    const dashboardInterval = setInterval(() => {
      setCurrentDashboardImage((prev) => (prev + 1) % dashboardImages.length);
    }, 3000);
    
    const vehiclesInterval = setInterval(() => {
      setCurrentVehiclesImage((prev) => (prev + 1) % vehiclesImages.length);
    }, 3000);
    
    const alertsInterval = setInterval(() => {
      setCurrentAlertsImage((prev) => (prev + 1) % alertsImages.length);
    }, 3000);
    
    const expensesInterval = setInterval(() => {
      setCurrentExpensesImage((prev) => (prev + 1) % expensesImages.length);
    }, 3000);
    
    const analyticsInterval = setInterval(() => {
      setCurrentAnalyticsImage((prev) => (prev + 1) % analyticsImages.length);
    }, 3000);
    
    // Cleanup intervals on component unmount
    return () => {
      clearInterval(dashboardInterval);
      clearInterval(vehiclesInterval);
      clearInterval(alertsInterval);
      clearInterval(expensesInterval);
      clearInterval(analyticsInterval);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 text-gray-800">
      {/* Navigation */}
      <motion.nav 
        className="flex justify-between items-center py-6 px-8 bg-white bg-opacity-90 backdrop-blur-sm sticky top-0 z-10 shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-2xl font-bold text-blue-600"
          whileHover={{ scale: 1.05 }}
        >
          Vehitrack
        </motion.div>
        <motion.div className="flex gap-6">
          <motion.a 
            href="#features" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            whileHover={{ y: -2 }}
          >
            Fonctionnalités
          </motion.a>
          <motion.a 
            href="#testimonials" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            whileHover={{ y: -2 }}
          >
            Témoignages
          </motion.a>
          <motion.a 
            href="#contact" 
            className="text-gray-600 hover:text-blue-600 transition-colors"
            whileHover={{ y: -2 }}
          >
            Contact
          </motion.a>
        </motion.div>
      </motion.nav>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 md:px-8 lg:px-16">
        <motion.div 
          className="absolute inset-0 -z-10 bg-blue-100 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-300 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-200 to-transparent rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-left"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight"
              variants={slideUp}
            >
              Gérez votre flotte <span className="text-blue-600">intelligemment</span>
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-600"
              variants={slideUp}
            >
              Simplifiez la gestion de vos véhicules, documents et dépenses avec une solution tout-en-un.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={slideUp}
            >
              <motion.a 
                href="#contact"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl inline-block text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demander une démo
              </motion.a>
              <motion.button 
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                En savoir plus
              </motion.button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-white p-4 rounded-2xl shadow-xl overflow-hidden aspect-video">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentDashboardImage}
                  src={dashboardImages[currentDashboardImage]}
                  alt="Dashboard de Vehitrack" 
                  className="h-full w-full object-cover rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/800x450/e2e8f0/475569?text=Dashboard+Vehitrack';
                  }}
                />
              </AnimatePresence>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {dashboardImages.map((_, index) => (
                  <button 
                    key={index}
                    onClick={() => setCurrentDashboardImage(index)}
                    className={`w-2 h-2 rounded-full ${currentDashboardImage === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <motion.div 
              className="absolute -bottom-4 -right-4 bg-blue-100 w-24 h-24 rounded-full z-[-1]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -top-4 -left-4 bg-blue-200 w-16 h-16 rounded-full z-[-1]"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 md:px-8 lg:px-16 bg-white">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            variants={slideUp}
          >
            Fonctionnalités <span className="text-blue-600">clés</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 text-4xl mb-4">📁</div>
              <h3 className="text-xl font-semibold mb-2">Gestion complète</h3>
              <p className="text-gray-600">Gérez facilement vos véhicules, documents, utilisateurs et sites depuis une interface unique.</p>

            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold mb-2">Alertes intelligentes</h3>
              <p className="text-gray-600">Recevez des notifications avant l'expiration de vos documents importants.</p>

            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Suivi des dépenses</h3>
              <p className="text-gray-600">Visualisez et analysez vos dépenses avec des graphiques interactifs.</p>

            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Tableau de bord</h3>
              <p className="text-gray-600">Accédez à toutes vos données facilement.</p>

            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Multi-utilisateurs</h3>
              <p className="text-gray-600">Ajouter des utilisateurs facilement.</p>
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={slideUp}
              whileHover={{ y: -5 }}
            >
              <div className="text-blue-600 text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Responsive</h3>
              <p className="text-gray-600">Accédez à votre plateforme facilement  .</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 md:px-8 lg:px-16 bg-gradient-to-b from-blue-50 to-white">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            variants={slideUp}
          >
            Ce que nos clients <span className="text-blue-600">disent</span>
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={slideUp}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">KD</div>
                <div>
                  <h4 className="font-semibold">K. Diabaté</h4>
                  <p className="text-sm text-gray-500">LogiTrans CI</p>
                </div>
              </div>
              <blockquote className="italic text-gray-600">
                "Vehitrack nous a fait gagner du temps et évité des oublis coûteux. L'interface est intuitive et l'équipe support très réactive."
              </blockquote>
              <div className="mt-4 text-yellow-400">★★★★★</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={slideUp}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">MT</div>
                <div>
                  <h4 className="font-semibold">M. Touré</h4>
                  <p className="text-sm text-gray-500">TransportExpress</p>
                </div>
              </div>
              
              <div className="mt-4 text-yellow-400">★★★★★</div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-md"
              variants={slideUp}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">SC</div>
                <div>
                  <h4 className="font-semibold">S. Camara</h4>
                  <p className="text-sm text-gray-500">Logistics Plus</p>
                </div>
              </div>
              <blockquote className="italic text-gray-600">
                "La solution idéale pour gérer notre flotte de plus de 50 véhicules. Les alertes automatiques nous évitent des pénalités et des immobilisations."
              </blockquote>
              <div className="mt-4 text-yellow-400">★★★★☆</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-24 px-6 md:px-8 lg:px-16 bg-blue-600 text-white">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div variants={slideUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à optimiser la gestion de votre flotte ?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Demandez une démo personnalisée et découvrez comment Vehitrack peut transformer votre gestion de flotte.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center">
                  <div className="mr-3 text-blue-300">✓</div>
                  <p>Installation rapide</p>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-blue-300">✓</div>
                  <p>Support dédié</p>
                </div>
                <div className="flex items-center">
                  <div className="mr-3 text-blue-300">✓</div>
                  <p>30 jours d'essai</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={slideUp}
              className="bg-white p-8 rounded-xl shadow-xl text-gray-800"
            >
              <h3 className="text-2xl font-bold mb-6 text-blue-600">Demandez une démo</h3>
              {formStatus.submitted ? (
                <motion.div 
                  className={`p-4 rounded-lg mb-6 ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {formStatus.message}
                </motion.div>
              ) : null}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nom complet"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    whileFocus={{ scale: 1.01 }}
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    whileFocus={{ scale: 1.01 }}
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    whileFocus={{ scale: 1.01 }}
                    required
                  />
                </div>
                <div>
                  <motion.select
                    name="fleetSize"
                    value={formData.fleetSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <option value="" disabled>Taille de votre flotte</option>
                    <option value="small">1-10 véhicules</option>
                    <option value="medium">11-50 véhicules</option>
                    <option value="large">51-200 véhicules</option>
                    <option value="enterprise">200+ véhicules</option>
                  </motion.select>
                </div>
                <motion.button 
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.03 }}
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
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <motion.h3 
              className="text-2xl font-bold mb-4 text-blue-400"
              whileHover={{ x: 2 }}
            >
              Vehitrack
            </motion.h3>
            <p className="text-gray-400 mb-4">La solution intelligente pour la gestion de votre flotte de véhicules.</p>
         
          </div>
       
         
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <motion.li whileHover={{ x: 2 }}>bslreda26@hotmail.com</motion.li>
              <motion.li whileHover={{ x: 2 }}>+225 07 02 60 43 09</motion.li>
              <motion.li whileHover={{ x: 2 }}>Abidjan, Côte d'Ivoire</motion.li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>© Vehitrack 2025 — Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
