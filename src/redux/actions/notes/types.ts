export type Note = {
    Content: String,
    Title: String
}

export type Notes = {
    notes: Note[];
    notConnected: boolean;
    loading: boolean;
    error: boolean;
}
