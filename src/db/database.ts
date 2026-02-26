import * as SQLite from 'expo-sqlite';
import { Role } from '../context/RoleContext';

export interface User {
    id: number;
    name: string;
    role: Role;
}

export interface MedicalRecord {
    id: number;
    user_id: number;
    document_uri: string;
    ai_summary: string;
    date_created: string;
}

// In Expo SDK 50+, openDatabaseSync is the synchronous API
const dbName = 'medassist.db';

export const initDb = async () => {
    try {
        const db = await SQLite.openDatabaseAsync(dbName);
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                role TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS Records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                document_uri TEXT NOT NULL,
                ai_summary TEXT NOT NULL,
                date_created TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
            );
        `);
        console.log('Database initialized');
    } catch (error) {
        console.error('Error initializing database', error);
        throw error;
    }
};

export const createUser = async (name: string, role: Role): Promise<number> => {
    const db = await SQLite.openDatabaseAsync(dbName);
    const result = await db.runAsync(
        'INSERT INTO Users (name, role) VALUES (?, ?)',
        name,
        role || ''
    );
    return result.lastInsertRowId;
};

export const fetchAllUsers = async (): Promise<User[]> => {
    const db = await SQLite.openDatabaseAsync(dbName);
    const users = await db.getAllAsync<User>('SELECT * FROM Users ORDER BY id DESC');
    return users;
};

export const saveMedicalRecord = async (userId: number, documentUri: string, summary: string): Promise<number> => {
    const db = await SQLite.openDatabaseAsync(dbName);
    const date = new Date().toISOString();
    const result = await db.runAsync(
        'INSERT INTO Records (user_id, document_uri, ai_summary, date_created) VALUES (?, ?, ?, ?)',
        userId,
        documentUri,
        summary,
        date
    );
    return result.lastInsertRowId;
};

export const fetchRecordsByUser = async (userId: number): Promise<MedicalRecord[]> => {
    const db = await SQLite.openDatabaseAsync(dbName);
    const records = await db.getAllAsync<MedicalRecord>(
        'SELECT * FROM Records WHERE user_id = ? ORDER BY date_created DESC',
        userId
    );
    return records;
};
