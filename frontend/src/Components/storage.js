export class Storage {
    _username;
    projectname;
    projectdesc;

    static getUsername() {
        return this._username;
    }

    static setUsername(username) {
        this._username = username;
    }
    static getProjectname() {
        return this.projectname;
    }

    static setProjectname(projectname) {
        this.projectname = projectname;
    }
    static getProjectdesc() {
        return this.projectdesc;
    }

    static setProjectdesc(projectdesc) {
        this.projectdesc = projectdesc;
    }
}