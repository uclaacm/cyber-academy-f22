const core = require('@actions/core');
const github = require('@actions/github');
const toml = require('toml');
const fs = require('fs');
const { exit } = require('process');

const loadTomlFile = filePath => toml.parse(fs.readFileSync(filePath, 'utf8'));
const withGithubWorkspacePath = path => `${process.env.GITHUB_WORKSPACE}/${path}`

var schema; 
try {
  schema = loadTomlFile(withGithubWorkspacePath(core.getInput('path-to-schema-challenges')));
} catch (e) {
  console.log('ERROR: Challenge Schema could not be loaded')
  core.setFailed('Check output for errors')
  exit(1)
}

const challengesPath = withGithubWorkspacePath('challenges/');

fs.readdir(challengesPath, (err, folders) => {
  if (err) {
    console.log('ERROR: Could not open challenges/')
    core.setFailed('Check output for errors')
    return
  }

  let status = true;
  
  folders.filter(folder => folder !== "README.md").forEach(folder => {
    console.log('______________________________________________________')
    console.log('CHALLENGE: ' + folder)

    const filepath = `${challengesPath}/${folder}/challenge.toml`;
    try {
      const data = loadTomlFile(filepath);
      
      // validate
      Object.keys(schema).forEach(key => {
        // validate fields are present
        if (!(key in data)) {
          status = false;
          console.log(`ERROR: In ${folder}: ${key} field is missing`)
        } else {
          // validate type
          switch (schema[key]) {
            case "array":
              if (!Array.isArray(data[key])) {
                status = false;
                console.log(`ERROR: In ${folder}: ${key} field is of the wrong type. It should be type array`)
              }
              break;
            default:
              if (typeof data[key] !== schema[key]) {
                status = false;
                console.log(`ERROR: In ${folder}: ${key} field is of the wrong type. It should be type ${schema[key]}`)
              }
          }
        }

        // special validation
        if (key === 'files' && Array.isArray(data[key])) {
          data[key].forEach(file => {
            if ('description' in data && typeof data['description'] === "string") {
              if (data['description'].search(new RegExp(`\\[.+\\]\\(${file}\\)`)) === -1) {
                status = false;
                console.log(`ERROR: In ${folder}: Description is missing link to ${file}`)
              }

              const matches = data['description'].match(/\[.+\]\(([-a-zA-Z0-9()_.]+)\)/);
              
              matches.forEach((val, i) => {
                if (i % 2 === 1) {
                  if (!data['files'].includes(val)) {
                    status = false;
                    console.log(`ERROR: In ${folder}: ${val} is missing in files`)
                  }
                }
              })
            }
          })
        }
      })
    } catch (e) {
      console.log(`ERROR: In ${folder} toml file on line ${e.line}, column ${e.column}: ${e.message}`);
      status = false;
    }
  });

  if (!status) {
    core.setFailed('Check output for errors')
  }
})

var eventSchema; 
try {
  eventSchema = loadTomlFile(withGithubWorkspacePath(core.getInput('path-to-schema-events')));
} catch (e) {
  console.log('ERROR: Event Schema could not be loaded')
  core.setFailed('Check output for errors')
  exit(1)
}

const eventsPath = withGithubWorkspacePath('events/');

fs.readdir(eventsPath, (err, folders) => {
  if (err) {
    console.log('ERROR: Could not open events/')
    core.setFailed('Check output for errors')
    return
  }

  let status = true;
  
  folders.filter(folder => folder !== "README.md").forEach(folder => {
    console.log('______________________________________________________')
    console.log('EVENT: ' + folder)

    const filepath = `${eventsPath}/${folder}/event.toml`;
    try {
      const data = loadTomlFile(filepath);
      
      // validate
      Object.keys(eventSchema).forEach(key => {
        // validate fields are present
        if (!(key in data)) {
          status = false;
          console.log(`ERROR: In ${folder}: ${key} field is missing`)
        } else {
          // validate type
          switch (eventSchema[key]) {
            case "array":
              if (!Array.isArray(data[key])) {
                status = false;
                console.log(`ERROR: In ${folder}: ${key} field is of the wrong type. It should be type array`)
              }
              break;
            default:
              if (typeof data[key] !== eventSchema[key]) {
                status = false;
                console.log(`ERROR: In ${folder}: ${key} field is of the wrong type. It should be type ${eventSchema[key]}`)
              }
          }
        }
      })
    } catch (e) {
      console.log(`ERROR: In ${folder} toml file on line ${e.line}, column ${e.column}: ${e.message}`);
      status = false;
    }
  });

  if (!status) {
    core.setFailed('Check output for errors')
  }
})

try {
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}