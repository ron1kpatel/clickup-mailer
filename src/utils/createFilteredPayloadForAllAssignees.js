export const createFilteredPayloadForAllAssignees = (payload) => {
    if (!payload) {
        console.log('Payload is required.');
    }

    const filteredPayloads = [];

    payload.teams.forEach(team => {
        team.members.forEach(member => {
            
            const userPayload = {
                member: member.user,
                spaces: []
            };

            team.spaces.forEach(space => {
                const filteredSpace = {
                    id: space.id,
                    name: space.name,
                    folders: []
                };

                space.folders.forEach(folder => {
                    const filteredFolder = {
                        id: folder.id,
                        name: folder.name,
                        lists: []
                    };

                    folder.lists.forEach(list => {
                        const filteredList = {
                            id: list.id,
                            name: list.name,
                            tasks: [],
                            folderless: folder.name === 'folderless' ? true : false
                        };

                        if (list.tasks && Array.isArray(list.tasks.tasks)) {
                            list.tasks.tasks.forEach(task => {
                                if (task.assignees && task.assignees.some(assignee => assignee.email === member.user.email)) {
                                    filteredList.tasks.push(task);
                                }
                            });
                        }

                        if (filteredList.tasks.length > 0) {
                            filteredFolder.lists.push(filteredList);
                        }
                    });

                    if (filteredFolder.lists.length > 0) {
                        filteredSpace.folders.push(filteredFolder);
                    }
                });

                if (filteredSpace.folders.length > 0) {
                    userPayload.spaces.push(filteredSpace);
                }
            });

            filteredPayloads.push(userPayload);
        });
    });

    return filteredPayloads;
};