const rulesDatabasePath = window.RAJTVONAL_RULES_DATABASE_PATH || "../../database/F1";

fetch(`${rulesDatabasePath}/rules.txt`)
  .then(response => response.text())
  .then(text => generateRules(text));
