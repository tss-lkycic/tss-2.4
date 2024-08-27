export const translatePrompts = {
  textPrompt: (text) => {
    return `${text} Extract and summarize the tasks from the text into a set of sentences and return them such that each task is numbered. Keep each sentence shorter than 10 words.`;
  },
  jobPrompt: (job) => {
    return `Create a list of tasks for the job: ${job}, even if the job does not exist yet, into a set of sentences and return them such that each task is numbered. Keep each sentence shorter than 10 words.`;
  },
  hobbyPrompt: (hobbies) => {
    return `For each hobby or daily activity in this list: ${hobbies}, convert them into task sentences, each shorter than 10 words and return them such that each task is numbered.`;
  },
};

export const comparePrompts = {
  textPrompt: (text) => {
    return (
      text +
      " Extract and summarise the tasks from the text into a set of sentences and return them such that each task is numbered. Keep each text to less than 10 words."
    );
  },

  jobPrompt: (job) => {
    return (
      "Create a list of tasks for the job," +
      job +
      ", even if the job does not exist yet, into a set of sentences and return them such that each task is numbered. Keep each sentence shorter than 10 words."
    );
  },

  hobbyPrompt: (hobbies) => {
    return (
      "For each hobby or daily activity in this list:" +
      hobbies +
      ", convert them into tasks sentences and return them such that each task is numbered. e.g. Choreograph dances or performances for events. Keep each sentence shorter than 10 words."
    );
  },
};

export const transitionPrompts = {
  stepOnePrompt: (jobs, text) => {
    return (
      "These are the jobs I have done before: " +
      jobs +
      " And this is my resume: " +
      text +
      " Please extract and summarise tasks from my past jobs and resume into a set of sentences, and return them such that they are numbered."
    );
  },

  stepTwoPrompt: (hobbies) => {
    return (
      "For each hobby or daily activity in this list: " +
      hobbies +
      ", convert them into tasks sentences and return them such that each task is numbered. e.g. Choreograph dances or performances for events."
    );
  },

  comparePrompt: (job) => {
    return (
      "Create a list of tasks for the job," +
      job +
      "," +
      "  even if the job does not exist yet, into a set of sentences and return them such that each task is numbered. "
    );
  },

  adjacentJobsPrompt: (tasks, considerations) => {
    return (
      "Given the following list of general tasks and considerations, tasks:" +
      tasks +
      "considerations," +
      considerations +
      "return only, a numbered list of the top possible jobs suitable for this person, without any descriptions, just the job titles e.g. Frontend Developer."
    );
  },

  emergingJobsPrompt: (tasks, considerations) => {
    return (
      "Given the following list of general tasks and considerations, tasks:" +
      tasks +
      "considerations," +
      considerations +
      "return only, a numbered list of the top emerging jobs that is suitable for this person, without any descriptions, just the job titles e.g. Data Scientist."
    );
  },

  gigJobsPrompt: (tasks, considerations) => {
    return (
      "Given the following list of general tasks and considerations, tasks:" +
      tasks +
      "considerations," +
      considerations +
      "return only, a numbered list of the possible gig jobs or internships suitable for this person, without any descriptions, just the job titles e.g. UIUX Intern."
    );
  },
};
