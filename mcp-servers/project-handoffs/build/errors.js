export class ProjectError extends Error {
    constructor(message, projectId) {
        super(`Project ${projectId}: ${message}`);
        this.projectId = projectId;
        this.name = 'ProjectError';
    }
}
