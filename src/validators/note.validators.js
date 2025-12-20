export const validateNoteCreation = (noteData) => {
    const errors = [];
    const { title, content } = noteData;

    if (!title || title.trim() === "") {
        errors.push("Title is required");
    }
    if (!content || content.trim() === "") {
        errors.push("Content is required");
    }

    return errors;
};

export const validateNoteUpdate = ({ title, content, versionNumber }) => {
    if (!title || !content) return "title and content are required";
    if (typeof versionNumber !== "number")
        return "version is required and must be a number";
    return null;
};