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