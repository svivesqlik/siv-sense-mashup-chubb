senseConnection.statesConfig = {
  //
  // SAP CRM 
  //
  "sap-crm": {
    "dashboard": {
      "template": "templates/crm/dashboard.html",
      "menu": "templates/crm/menu.html"
    },
    "cotizaciones": {
      "template": "templates/crm/cotizaciones.html",
      "menu": "templates/crm/menu.html"
    },
    "visitas": {
      "template": "templates/crm/visitas.html",
      "menu": "templates/crm/menu.html"
    },
    "customer-portal": {
      "template": "templates/crm/customer-portal.html",
      "menu": "templates/crm/menu.html"
    }
  },
  //
  // FIORI - 1 estado por tile
  //
  "sap-fiori": {
    "dashboard": {
      "template": "templates/fiori/dashboard.html",
    },
    "visitas": {
      "template": "templates/fiori/visitas.html",
    },
    "customer-portal": {
      "template": "templates/fiori/customer-portal.html",
    }
  },
  //
  // Customer Portal
  //
  "customer-portal": {
    "purchases": [{
        "languages": [
          "EN",
          "ES"
        ],
        "template": "templates/cp/purchases.html",
        "menu": "templates/cp/menu.html"
      },
      {
        "languages": "PL",
        "template": "templates/cp/purchases_PL.html",
        "menu": "templates/cp/menu.html"
      }
    ],

    "destinations": {
      "languages": "*",
      "template": "templates/cp/destinations.html",
      "menu": "templates/cp/menu.html"
    },

    "finance": {
      "languages": "*",
      "template": "templates/cp/finance.html",
      "menu": "templates/cp/menu.html"
    }
  }
};