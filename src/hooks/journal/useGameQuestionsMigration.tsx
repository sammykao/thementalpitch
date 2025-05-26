
export interface QuestionMigration {
  version: number;
  migrate: (questions: any[]) => any[];
}

// Current version of the questions schema
export const CURRENT_QUESTIONS_VERSION = 3;

// Migration from version 1 to version 2: Update question 9 text
const migration_v1_to_v2: QuestionMigration = {
  version: 2,
  migrate: (questions) => {
    return questions.map(q => {
      if (q.id === "9" && q.text === "How'd you feel playing against the player you were matched up against?") {
        return {
          ...q,
          text: "How did I feel playing against the player I was matched up against?"
        };
      }
      return q;
    });
  }
};

// Migration from version 2 to version 3: Update question 10 text
const migration_v2_to_v3: QuestionMigration = {
  version: 3,
  migrate: (questions) => {
    return questions.map(q => {
      if (q.id === "10" && q.text === "How'd you feel in your team's system against the system you were against?") {
        return {
          ...q,
          text: "How'd I feel in my team's system against the system we were up against?"
        };
      }
      return q;
    });
  }
};

// All available migrations in order
const migrations: QuestionMigration[] = [
  migration_v1_to_v2,
  migration_v2_to_v3
];

export function migrateGameQuestions(storedData: any): any[] {
  let questions = storedData.questions || storedData;
  let currentVersion = storedData.version || 1;

  // Apply migrations in order
  for (const migration of migrations) {
    if (currentVersion < migration.version) {
      questions = migration.migrate(questions);
      currentVersion = migration.version;
    }
  }

  return questions;
}

export function createVersionedQuestionsData(questions: any[]): any {
  return {
    version: CURRENT_QUESTIONS_VERSION,
    questions: questions
  };
}
