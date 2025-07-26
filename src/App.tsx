import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/welcomePage";
import AddUser from "./components/users/adduser";
import Login from "./components/users/login";
import AddVehicle from "./components/vehicles/addVehicle";
import AddChauffeur from "./components/chauffeurs/addChauffeur";
import DocTypes from "./components/documents/DocTypes";
import DocumentsByType from "./components/documents/DocumentsByType";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";
import Navbar from "./components/navbar";
import Users from "./components/users/users";
import EditUser from "./components/users/edituser";
import Vehicles from "./components/vehicles/vehicle";
import AddVehicletype from "./components/vehicles/addvehicletype";
import Dashboard from "./components/dashboard";
import Chauffeur from "./components/chauffeurs/Chauffeur";
import EditVehicle from "./components/vehicles/editvehicle";
import EditChauffeur from "./components/chauffeurs/editchauffeur";
import Editchauffeur from "./components/chauffeurs/editchauffeur";
import { addLocale, locale } from "primereact/api";
import Documentsbytypes from "./components/documents/DocumentsByType";
import Documentsbytype from "./components/documents/DocumentsByType";
import DocumentsBytype from "./components/documents/DocumentsByType";
import Companies from "./components/companies/Companies";
import AddDocuments from "./components/vehicles/adddocuments";
import VehicleDocuments from './components/vehicles/VehicleDocuments';
import Maintenance from './components/maintenance/Maintenance';
import TableauDeBord from './components/TableauDeBord';
import Parametres from './components/parametres/Parametres';
import ProtectedRoute from './components/ProtectedRoute';
import AuthProvider from './components/AuthProvider';
import AuthenticatedLayout from './components/AuthenticatedLayout';

function App() {

  addLocale('fr', {
    startsWith: "Commence par",
    contains: "Contient",
    notContains: "Ne contient pas",
    endsWith: "Se termine par",
    equals: "Égal à",
    notEquals: "Différent de",
    noFilter: "Aucun filtre",
    filter: "Filtre",
    lt: "Inférieur à",
    lte: "Inférieur ou égal à",
    gt: "Supérieur à",
    gte: "Supérieur ou égal à",
    dateIs: "La date est",
    dateIsNot: "La date n'est pas",
    dateBefore: "Avant le",
    dateAfter: "Après le",
    custom: "Personnalisé",
    clear: "Effacer",
    apply: "Appliquer",
    matchAll: "Correspond à tous",
    matchAny: "Au moins un Correspond",
    addRule: "Ajouter une règle",
    removeRule: "Retirer une règle",
    accept: "Oui",
    reject: "Non",
    choose: "Choisir",
    upload: "Envoyer",
    cancel: "Annuler",
    pending: "En attente",
    fileSizeTypes: [
      "o",
      "Ko",
      "Mo",
      "Go",
      "To",
      "Po",
      "Eo",
      "Zo",
      "Yo"
    ],
    dayNames: [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi"
    ],
    dayNamesShort: [
      "Dim",
      "Lun",
      "Mar",
      "Mer",
      "Jeu",
      "Ven",
      "Sam"
    ],
    dayNamesMin: [
      "Di",
      "Lu",
      "Mar",
      "Mer",
      "Je",
      "Ve",
      "Sa"
    ],
    monthNames: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre"
    ],
    monthNamesShort: [
      "Jan",
      "Fev",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jui",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ],
    chooseYear: "Choisir une année",
    chooseMonth: "Choisir un mois",
    chooseDate: "Choisir une date",
    prevDecade: "Décennie précédente",
    nextDecade: "Décennie suivante",
    prevYear: "Année précédente",
    nextYear: "Année suivante",
    prevMonth: "Mois précédent",
    nextMonth: "Mois suivant",
    prevHour: "Heure précédente",
    nextHour: "Heure suivante",
    prevMinute: "Minute précédente",
    nextMinute: "Minute suivante",
    prevSecond: "Seconde précédente",
    nextSecond: "Seconde suivante",
    am: "am",
    pm: "pm",
    today: "Aujourd'hui",
    weekHeader: "Sem",
    firstDayOfWeek: 1,
    dateFormat: "dd/mm/yy",
    weak: "Faible",
    medium: "Moyen",
    strong: "Fort",
    passwordPrompt: "Saisissez un mot de passe",
    emptyFilterMessage: "Aucun résultat trouvé",
    emptyMessage: "Aucune option disponible",
    aria: {
      trueLabel: "Vrai",
      falseLabel: "Faux",
      nullLabel: "Aucune sélection",
      star: "1 étoile",
      stars: "{star} étoiles",
      selectAll: "Tous éléments sélectionnés",
      unselectAll: "Tous éléments désélectionnés",
      close: "Fermer",
      previous: "Précédent",
      next: "Suivant",
      navigation: "Navigation",
      scrollTop: "Défiler tout en haut",
      moveTop: "Déplacer tout en haut",
      moveUp: "Déplacer vers le haut",
      moveDown: "Déplacer vers le bas",
      moveBottom: "Déplacer tout en bas",
      moveToTarget: "Déplacer vers la cible",
      moveToSource: "Déplacer vers la source",
      moveAllToTarget: "Tout déplacer vers la cible",
      moveAllToSource: "Tout déplacer vers la source",
      pageLabel: "Page {page}",
      firstPageLabel: "Première Page",
      lastPageLabel: "Dernière Page",
      nextPageLabel: "Page Suivante",
      rowsPerPageLabel: "Lignes par page",
      previousPageLabel: "Page précédente",
      jumpToPageDropdownLabel: "Aller à la page",
      jumpToPageInputLabel: "Aller à la page",
      selectRow: "Ligne sélectionnée",
      unselectRow: "Ligne désélectionnée",
      expandRow: "Ligne dépliée",
      collapseRow: "Ligne repliée",
      showFilterMenu: "Montre le menu des filtres",
      hideFilterMenu: "Masque le menu des filtres",
      filterOperator: "Opérateur de filtrage",
      filterConstraint: "Contrainte de filtrage",
      editRow: "Édite une ligne",
      saveEdit: "Sauvegarde l'édition",
      cancelEdit: "Annule l'édition",
      listView: "Vue en liste",
      gridView: "Vue en grille",
      slide: "Diapositive",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoomer l'image",
      zoomIn: "Zoomer",
      zoomOut: "Dézoomer",
      rotateRight: "Tourner vers la droite",
      rotateLeft: "Tourner vers la gauche"

    }
  })

  locale('fr');

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/" element={
              <ProtectedRoute requireAuth={false}>
                <WelcomePage />
              </ProtectedRoute>
            } />
            <Route path="/Login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />

            {/* Protected routes - authentication required */}
            <Route path="/tableau-de-bord" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <TableauDeBord />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/Adduser" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AddUser />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/Edituser" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <EditUser />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/Addvehicle" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AddVehicle />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/Chauffeur" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Chauffeur />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/ADDChauffeur" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AddChauffeur />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/DocTypes" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <DocTypes />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/documents/:typeId" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <DocumentsBytype />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/Users" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Users />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/vehicle" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Vehicles />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/AddVehicletype" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AddVehicletype />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/EditVehicle/:id" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <EditVehicle />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/editchauffeur/:id" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Editchauffeur />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/companies" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Companies />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/vehicles/:vehicleId/add-document" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AddDocuments />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/vehicles/:vehicleId/documents" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <VehicleDocuments />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/maintenance/*" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Maintenance />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/parametres" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Parametres />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />

            {/* Catch all route - redirect to welcome page */}
            <Route path="*" element={
              <ProtectedRoute requireAuth={false}>
                <WelcomePage />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
