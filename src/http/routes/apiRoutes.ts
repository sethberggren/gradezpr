export const apiRoutes = {
    loginWithGoogle: "/auth/login/google",
    grantAdditionalScopes: "/auth/google/scopes",
    initialize: "/gradeupdater/initialize",
    deleteUser: "/auth/delete",
    login: "/auth/login",
    register: "/auth/register",
    changePassword: "/auth/password-change",
    forgotPassword: "/auth/forgot-password",
    students: "/gradeupdater/students",
    bulkUploadStudents: "/gradeupdater/students/bulk",
    courses: "/gradeupdater/courses",
    uploadFileStats: "/gradeupdater/upload",
    welcome: "/gradeupdater/welcome",
    uploadFileCurve: "/gradeupdater/upload/curve",
    assignments: "/gradeupdater/assignments",
    hasSeenWelcome: "/gradeupdater/has-seen-welcome",
    linkWithGoogle: "/auth/register/google-link",
    registerWithGoogle: "/auth/register/google",
    getDriveFiles: "/drive/files",
    importDriveFile: "/drive/import",
    curveDriveFile: "/drive/curve",
    userRequest: "/userRequest"
} as const;
