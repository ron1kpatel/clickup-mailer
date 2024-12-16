// Clickup Script
// 1. Get teams
// 2. Get spaces
// 3. Get folders
// 4. Get lists
// 5. Get tasks

// 6. Group them as upcoming tasks for monday
// Get the tasks title, description and tags
// 7. Group the tasks of the week as pendin and completed

const axios = require("axios");
const moment = require("moment-timezone");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");
const baseURL = "https://api.clickup.com/api/v2/";
const apiKey = "pk_50221212_LT0OBEI97CWI1NDR41PRDH0OQMZDZMBK";
const workspaceName = "Pardy Panda Studios";

const sentFrom = new Sender(
  "updates@trial-neqvygmvrxjg0p7w.mlsender.net",
  "Pardy Panda Studios"
);

const mailerSend = new MailerSend({
  apiKey: `mlsn.7dfe771e1c48a0918220734cf930c58b77fc6ed7aea8415c091a0e152253e114`,
});
let workspaceId = "";

// let workspaceId = "3346476";

const api = async (path, payload = {}, method = "GET") => {
  try {
    const response = await axios({
      url: `${baseURL}${path}`,
      method, // Dynamically set the method (GET, POST, etc.)
      headers: {
        Authorization: apiKey,
      },
      data: method !== "GET" ? payload : undefined, // Use payload for non-GET methods
      params: method === "GET" ? payload : undefined, // Use payload as query params for GET
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error; // Optionally rethrow the error for further handling
  }
};

const getData = async () => {
  try {
    // Get current week in epoch milliseconds
    // Filter the tasks whose start date lies in this week time interval
    const weekStart = moment().utc().startOf("W").valueOf();
    const weekEnd = moment().utc().endOf("W").valueOf();

    const teams = await api("team");
    const result = {};
    // Get the team from name and if id is present directly find the spaces
    if (!!!workspaceId) {
      const teamMatch = teams["teams"].find((t) => t.name === workspaceName);
      workspaceId = teamMatch.id;
      result.id = teamMatch.id;
      result.name = teamMatch.name;
      //   console.log(`Team ${workspaceName}`, JSON.stringify(teamMatch));
    }

    // Get the spaces
    const spaces = await api(`team/${workspaceId}/space`);
    const spaceIds = spaces["spaces"].map((space) => {
      return {
        spaceId: space.id,
        spaceName: space.name,
        statuses: space.statuses,
      };
    });
    result.spaces = spaceIds;

    // console.log(spaceIds);

    // Get folders
    result.spaces = await Promise.all(
      spaceIds.map(async (space) => {
        // Fetch folders for the space
        const folders = await api(`space/${space.spaceId}/folder`);
        const listMembers = {};

        let folderIds = await Promise.all(
          folders["folders"].map(async (folder) => {
            // Map folder details
            const lists = await Promise.all(
              folder.lists.map(async (list) => {
                // Fetch Membes of the list and mark the tasks they made
                const membersAPI = await api(`list/${list.id}/member`);
                membersAPI["members"].map((member) => {
                  listMembers[member.email] = 0;
                });
                // Fetch tasks for each list
                const tasksAPI = await api(
                  `list/${list.id}/task?subtasks=true&include_closed=true`
                );

                // Process tasks and map subtasks under their parent task
                const tasks = tasksAPI["tasks"]
                  .filter(
                    (task) =>
                      task.start_date >= weekStart && task.start_date <= weekEnd
                  ) // Filter tasks within the week.
                  .filter((task) => !task.parent) // Filter only root-level tasks
                  .map((task) => {
                    listMembers[task.creator.email]++;

                    // Map subtasks for this task
                    const subTasks = tasksAPI["tasks"]
                      .filter(
                        (task) =>
                          task.start_date >= weekStart &&
                          task.start_date <= weekEnd
                      ) // Filter tasks within the week.
                      .filter((subTask) => subTask.parent === task.id) // Match subtasks with parent ID
                      .map((subTask) => ({
                        // subTaskId: subTask.id,
                        subTaskName: subTask.name,
                        // subTaskDescription: subTask.description,
                        // subTaskTags: subTask.tags.map((tag) => tag.name),
                        subTaskStatus: subTask.status.status,
                        // subTaskDueDate: subTask.due_date,
                        // subTaskStartDate: subTask.start_date,
                        subTaskAssignee: subTask.assignees.map(
                          (assignee) => assignee.username
                        ),
                      }));

                    // Return the task with its subtasks
                    return {
                      // taskId: task.id,
                      taskName: task.name,
                      // taskDescription: task.description,
                      // taskTags: task.tags.map((tag) => tag.name),
                      taskStatus: task.status.status,
                      // taskDueDate: task.due_date,
                      // taskStartDate: task.start_date,
                      taskAssignee: task.assignees.map(
                        (assignee) => assignee.username
                      ),
                      subTasks, // Attach subtasks to this task
                    };
                  });

                // Return the list details with tasks
                return {
                  listId: list.id,
                  listName: list.name,
                  tasks, // Include the tasks array
                };
              })
            );

            // Return folder details with lists
            return {
              folderId: folder.id,
              folderName: folder.name,
              lists,
            };
          })
        );

        if (folders["folders"].length === 0) {
          const listsWithoutFolders = await api(`space/${space.spaceId}/list`);

          //   console.log(lists);
          folderIds = await Promise.all(
            listsWithoutFolders["lists"].map(async (list) => {
              const membersAPI = await api(`list/${list.id}/member`);
              membersAPI["members"].map((member) => {
                listMembers[member.email] = 0;
              });
              // Fetch tasks for each list
              const tasksAPI = await api(
                `list/${list.id}/task?subtasks=true&include_closed=true`
              );

              // Process tasks and map subtasks under their parent task
              const tasks = tasksAPI["tasks"]
                .filter(
                  (task) =>
                    task.start_date >= weekStart && task.start_date <= weekEnd
                ) // Filter tasks within the week.
                .filter((task) => !task.parent) // Filter only root-level tasks
                .map((task) => {
                  listMembers[task.creator.email]++;

                  // Map subtasks for this task
                  const subTasks = tasksAPI["tasks"]
                    .filter(
                      (task) =>
                        task.start_date >= weekStart &&
                        task.start_date <= weekEnd
                    ) // Filter tasks within the week.
                    .filter((subTask) => subTask.parent === task.id) // Match subtasks with parent ID
                    .map((subTask) => ({
                      // subTaskId: subTask.id,
                      subTaskName: subTask.name,
                      // subTaskDescription: subTask.description,
                      // subTaskTags: subTask.tags.map((tag) => tag.name),
                      subTaskStatus: subTask.status.status,
                      // subTaskDueDate: subTask.due_date,
                      // subTaskStartDate: subTask.start_date,
                      subTaskAssignee: subTask.assignees.map(
                        (assignee) => assignee.username
                      ),
                    }));

                  // Return the task with its subtasks
                  return {
                    // taskId: task.id,
                    taskName: task.name,
                    // taskDescription: task.description,
                    // taskTags: task.tags.map((tag) => tag.name),
                    taskStatus: task.status.status,
                    // taskDueDate: task.due_date,
                    // taskStartDate: task.start_date,
                    taskAssignee: task.assignees.map(
                      (assignee) => assignee.username
                    ),
                    subTasks, // Attach subtasks to this task
                  };
                });
              return {
                folderId: list.folder.id,
                folderName: list.folder.name,
                lists: [
                  {
                    listId: list.id,
                    listName: list.name,
                    tasks,
                  },
                ],
              };
            })
          );
        }

        // Attach folders to the space
        space.folders = folderIds;
        space.listMembers = Object.entries(listMembers)
          .sort(([, valueA], [, valueB]) => valueB - valueA) // Sort by values
          .reduce((result, [key, value]) => {
            result[key] = value;
            return result;
          }, {});

        return space;
      })
    );
    return result;
    // console.log(`Result:`, JSON.stringify(result));
  } catch (error) {
    console.error("Error fetching teams:", error.message);
  }
};

const frameEmail = async () => {
  try {
    const dataObject = await getData(); // Fetch the data dynamically

    // Build the dynamic CSS styles for statuses
    const generateStatusStyles = (statuses) => {
      return "";
      // statuses
      //   .map(
      //     (status) => `
      //     .status-${status.status.replace(/\s+/g, "-").toLowerCase()} {
      //       background-color: ${status.color};
      //       padding:5px;
      //       border-radius:5px
      //     }
      //   `
      //   )
      //   .join("");

      // <span class="status-${task.taskStatus
      //               .replace(/\s+/g, "-")
      //               .toLowerCase()}">
      //               ${task.taskStatus}
      //               </span>
    };

    // Generate the HTML body for a single space
    const generateSpaceHtml = (space, statuses) => `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 0 20px;
            color:#022D71;
          }
          h1, h2 {
            text-align:center;
            color:#022D71;
            background-color:#7AE0E5;
          } 
          h3 {
            margin: 0 0 10px;
            padding-left:10px;
            border-radius:5px;
            color:#022D71;
            background-color:#7AE0E5;
          } 
          h4 {
            margin: 0 0 10px;
            padding-left:10px;
            border-radius:5px;
            background-color:#022D71;
            color:#7AE0E5;
          }
          ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
          .status {
            background-color: #7AE0E5;
            padding:2px 7px;
            border-radius:5px
          }
          ${generateStatusStyles(statuses)}
        </style>
      </head>
      <body>
        <h1>${space.spaceName} Weekly ${
      moment().utc().weekday() === 1 ? "Plan" : "Update"
    } ${moment().utc().startOf("W").format("DD/MM/YYYY")} - ${moment()
      .utc()
      .endOf("W")
      .subtract(2, "days")
      .format("DD/MM/YYYY")}</h1>
        ${space.folders
          .map(
            (folder) => `
            ${folder.lists
              .map(
                (list) => `
               ${
                 list.tasks.length === 0
                   ? ""
                   : `
                     ${
                       folder.folderName === "hidden"
                         ? ""
                         : `<h3>Folder: ${folder.folderName}</h3>`
                     }
                     <h4>List: ${list.listName}</h4>
                   <ul>
              ${list.tasks
                .map(
                  (task) => `
                <li>
                  <span>
                    ${task.taskName} |
                  </span>
                  <span class="status">
                    ${task.taskStatus}
                    </span>
                  ${
                    task.subTasks.length > 0
                      ? `
                      <ul>
                        ${task.subTasks
                          .map(
                            (subTask) => `
                          <li>
                            <span>
                              ${subTask.subTaskName} | 
                            </span>
                            <span class="status">
                             ${subTask.subTaskStatus}
                             </span>
                          </li>
                        `
                          )
                          .join("")}
                      </ul>
                    `
                      : ""
                  }
                </li>
              `
                )
                .join("")}
            </ul>
            <hr style="border: none; height: 5px; background-color: #022D71; width: 100%; margin: 20px 0;">
            `
               } 
            
          `
              )
              .join("")}
        `
          )
          .join("")}
      </body>
      </html>
    `;

    // Generate email content for each space
    // const emailContent = dataObject.spaces.map((space) => ({
    //   emailSubject: `${space.spaceName} - Project Status Report`,
    //   emailBody: generateSpaceHtml(space, space.statuses),
    //   mailersList: space.listMembers,
    // }));

    const emailContent = [
      {
        emailSubject: `${dataObject.spaces[1].spaceName} - Project Status Report`,
        emailBody: generateSpaceHtml(
          dataObject.spaces[1],
          dataObject.spaces[1].statuses
        ),
        mailersList: dataObject.spaces[1].listMembers,
      },
    ];
    console.log(emailContent[0].emailBody);

    for (const space of emailContent) {
      console.log(space.mailersList);
      const [firstKey] = Object.keys(space.mailersList);
      console.log(firstKey);

      const recipients = [new Recipient(firstKey)];
      // const ccRecipients = Object.keys(space.mailersList)
      //   .filter((key, index) => index !== 0)
      //   .map((key) => new Recipient(key));
      const ccRecipients = [new Recipient("radhika@pardypanda.com")];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setCc(ccRecipients)
        .setReplyTo(sentFrom)
        .setSubject(space.emailSubject)
        .setHtml(space.emailBody);

      // await mailerSend.email.send(emailParams);
    }
    return;
  } catch (error) {
    console.error("Error generating email:", error);
    throw error;
  }
};

(async () => {
  try {
    await frameEmail(); // Call the async function
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error in sending email:", error.message);
  }
})();
