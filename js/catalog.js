/* Accelevation Time — product teaching content; simplified game assemblies. */
(function (root) {
  "use strict";
  const families = [
    {
      id: "containment",
      name: "Containment",
      short: "Containment",
      label: "THERMAL MANAGEMENT",
      caption: "HOT / COLD AISLE SYSTEM",
      description:
        "Build the boundary that keeps hot exhaust and cold supply air apart.",
      value:
        "Keep airflow where it belongs, while maintaining access to critical equipment.",
      takeaway:
        "Containment panels, doors, roofs, and seals work together to separate hot and cold air. The system manages airflow around the racks.",
      sales:
        "We design, manufacture, and install containment around the customer’s data hall, coordinating the boundary and equipment access as one system.",
      proof:
        "Check boundary continuity, access, and complete component fit. This arcade assembly is a simplified illustration, not an installation procedure.",
      source: "https://www.accelevation.com/thermal-management",
      sourceTitle: "Accelevation thermal management",
      parts: [
        {
          name: "Frames & seals",
          code: "GAME-CONT-001",
          type: "frame",
          color: "#e7a16a",
          detail:
            "The supporting frame and sealing components define the aisle boundary.",
        },
        {
          name: "Containment panels",
          code: "GAME-CONT-002",
          type: "panel",
          color: "#91c8da",
          detail:
            "Modular panels separate air streams and fit the data hall layout.",
        },
        {
          name: "Aisle end doors",
          code: "GAME-CONT-003",
          type: "door",
          color: "#b5c4cd",
          detail:
            "Door assemblies provide access while maintaining the boundary.",
        },
        {
          name: "Roof panels",
          code: "GAME-CONT-004",
          type: "roof",
          color: "#a6cdb3",
          detail:
            "Roof systems complete the top boundary where the design requires one.",
        },
      ],
      quiz: {
        question: "What is the main job of aisle containment?",
        options: [
          "Separate hot exhaust from cold supply air.",
          "Supply electrical power to the racks.",
          "Replace the IT equipment in each rack.",
        ],
        answer: 0,
        explanation:
          "Exactly. The boundary directs airflow; doors preserve access.",
      },
    },
    {
      id: "structure",
      name: "SkyBridge™ structure",
      short: "Structure",
      label: "STRUCTURE & SUPPORT",
      caption: "MODULAR STRUCTURAL BAY",
      description:
        "Build the backbone for coordinated overhead infrastructure.",
      value:
        "Bring structure and supporting systems together before they reach the data hall.",
      takeaway:
        "SkyBridge is a prefabricated modular platform. Structure coordinates with containment, power, cooling, and conveyance in an integrated deployment.",
      sales:
        "SkyBridge brings multiple infrastructure systems into a coordinated, factory-built solution. TechFrame provides a configurable, bolt-together structural backbone.",
      proof:
        "Verify the specified connections, supporting structure, and complete kit. Structural checks belong to qualified teams, not game physics.",
      source: "https://www.accelevation.com/skybridge",
      sourceTitle: "Accelevation SkyBridge",
      parts: [
        {
          name: "Posts & base plates",
          code: "GAME-STRC-001",
          type: "post",
          color: "#b5c4cd",
          detail:
            "The floor interface and vertical posts support the structural assembly.",
        },
        {
          name: "Connection hardware",
          code: "GAME-STRC-002",
          type: "bolt",
          color: "#e7a16a",
          detail:
            "Specified brackets and hardware join the structural members.",
        },
        {
          name: "Support arms",
          code: "GAME-STRC-003",
          type: "arm",
          color: "#a6cdb3",
          detail: "Configured arms support the infrastructure layout.",
        },
        {
          name: "Structural beams",
          code: "GAME-STRC-004",
          type: "beam",
          color: "#91c8da",
          detail: "Beams connect the supporting framework across the bay.",
        },
      ],
      quiz: {
        question: "Why integrate infrastructure into a modular platform?",
        options: [
          "Every project must use the same layout.",
          "To coordinate systems before field installation.",
          "So supporting structure is no longer needed.",
        ],
        answer: 1,
        explanation:
          "Right. Factory integration helps coordinate the systems and field work.",
      },
    },
    {
      id: "power",
      name: "Power distribution",
      short: "Power",
      label: "POWER DISTRIBUTION",
      caption: "REMOTE POWER PANEL + WHIPS",
      description:
        "Bring the power distribution components together for the next deployment.",
      value:
        "Coordinate distribution equipment and connections around the customer’s load requirements.",
      takeaway:
        "Remote power panels distribute electrical power. Branch circuit whips connect distribution equipment to downstream loads as specified for the project.",
      sales:
        "Accelevation provides power distribution equipment and custom branch circuit whips, with installation and electrical fit-out capabilities to support the deployment.",
      proof:
        "Real readiness requires specified identification, inspection, and electrical testing by qualified personnel. The game never simulates an electrical certification.",
      source: "https://www.accelevation.com/power-products",
      sourceTitle: "Accelevation power products",
      parts: [
        {
          name: "RPP enclosure",
          code: "GAME-PWR-001",
          type: "enclosure",
          color: "#b5c4cd",
          detail:
            "The remote power panel enclosure houses the distribution components.",
        },
        {
          name: "Panel & breakers",
          code: "GAME-PWR-002",
          type: "breaker",
          color: "#e7a16a",
          detail:
            "The specified panel and breakers provide circuit distribution and protection.",
        },
        {
          name: "Branch circuit whips",
          code: "GAME-PWR-003",
          type: "cable",
          color: "#91c8da",
          detail:
            "Factory-built cable assemblies provide specified electrical connections.",
        },
        {
          name: "Identification kit",
          code: "GAME-PWR-004",
          type: "label",
          color: "#a6cdb3",
          detail:
            "Identification connects the physical assembly to the project documentation.",
        },
      ],
      quiz: {
        question: "What does an RPP do in a data center?",
        options: [
          "Separate hot and cold air.",
          "Hold the roof above the aisle.",
          "Distribute electrical power to downstream circuits.",
        ],
        answer: 2,
        explanation:
          "Correct. RPP means remote power panel; it is part of the power distribution system.",
      },
    },
    {
      id: "modular",
      name: "Modular integration",
      short: "Modular",
      label: "INTEGRATED DEPLOYMENT",
      caption: "COORDINATED INFRASTRUCTURE MODULE",
      description:
        "Combine repeatable building blocks into one coordinated module.",
      value:
        "Deliver an integrated customer solution, with the components and interfaces coordinated.",
      takeaway:
        "A modular system coordinates structure, power, conveyance, and thermal infrastructure. The customer receives an integrated solution rather than disconnected components.",
      sales:
        "Our design, manufacturing, and installation teams work together to turn configurable infrastructure into a coordinated deployment.",
      proof:
        "Check the complete bill of materials, system interfaces, required inspections, and handoff documentation before real-world release.",
      source: "https://www.accelevation.com/skybridge",
      sourceTitle: "Accelevation integrated SkyBridge platform",
      parts: [
        {
          name: "Module frame",
          code: "GAME-MOD-001",
          type: "frame",
          color: "#e7a16a",
          detail:
            "The module frame is the common backbone for the integrated assembly.",
        },
        {
          name: "Mounting hardware",
          code: "GAME-MOD-002",
          type: "bolt",
          color: "#b5c4cd",
          detail:
            "Mounting components locate and connect the configured equipment.",
        },
        {
          name: "Cable conveyance",
          code: "GAME-MOD-003",
          type: "tray",
          color: "#91c8da",
          detail:
            "Conveyance organizes the pathways for power and data cabling.",
        },
        {
          name: "Cooling manifold",
          code: "GAME-MOD-004",
          type: "pipe",
          color: "#a6cdb3",
          detail:
            "Supply and return infrastructure supports liquid cooling deployments.",
        },
      ],
      quiz: {
        question: "What is the customer buying at the end of the build?",
        options: [
          "A coordinated infrastructure solution.",
          "A pile of unrelated part numbers.",
          "Only the frame, without its interfaces.",
        ],
        answer: 0,
        explanation:
          "That’s the Accelevation story: design, manufacture, and install the complete solution.",
      },
    },
  ];
  root.AccelevationCatalog = families;
  if (typeof module !== "undefined" && module.exports)
    module.exports = families;
})(typeof globalThis !== "undefined" ? globalThis : this);
