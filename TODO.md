# TODO

This file lists the necessary features and future ideas for the My Notes App project.

## Necessary Features

- [ ] **Folder Functionality:**
    - [ ] Create new folders.
    - [ ] Delete folders.
    - [ ] Rename folders.
    - [ ] Move notes between folders.
- [ ] **Note Functionality:**
    - [ ] Create new notes.
        - [ ] **Create a "New Note" button:** Add a button to the UI (probably in the `NotesPage.jsx` or `Sidebar.jsx`) that triggers the note creation process.
        - [ ] **Create a new note in the database:** When the "New Note" button is clicked, insert a new record into the `notes` table in the Supabase database. The new note should have a default title (e.g., "Untitled Note") and an empty content. It should also be associated with the current user and the currently selected folder.
        - [ ] **Update the UI:** After the new note is created in the database, update the UI to display the new note in the notes list.
        - [ ] **Open the new note for editing:** Automatically select the new note and open it in the editor view, so the user can start writing immediately.
    - [ ] Delete notes.
    - [ ] Edit notes.
- [ ] **User Profile:**
    - [ ] View user information.
    - [ ] Change password.
- [ ] **Password Reset:**
    - [ ] "Forgot Password" functionality.

## Future Ideas

- [ ] **Rich Text Editor:** Implement a rich text editor (e.g., Quill, Slate.js) for more advanced note formatting.
- [ ] **Note Sharing:** Allow users to share notes with others.
- [ ] **Tagging System:** Add a tagging system to organize notes more flexibly.
- [ ] **Search Functionality:** Implement a powerful search feature to find notes quickly.
- [ ] **Customization:**
    - [ ] Different color themes for notes and folders.
    - [ ] Customizable layouts.
- [ ] **Mobile App:** Create a mobile application for iOS and Android (e.g., using React Native).
- [ ] **Collaboration:** Real-time collaboration on notes.
- [ ] **Reminders:** Set reminders for notes.
- [ ] **Attachments:** Attach files to notes.
