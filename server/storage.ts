import { users, projects, attendance, type User, type InsertUser, type Project, type Attendance } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  
  getProjects(): Promise<Project[]>;
  
  checkIn(userId: number, notes?: string): Promise<Attendance>;
  checkOut(userId: number): Promise<Attendance | undefined>;
  getCurrentAttendance(userId: number): Promise<Attendance | undefined>;
  getAttendanceHistory(userId: number): Promise<Attendance[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private attendance: Map<number, Attendance>;
  private currentId: { users: number; projects: number; attendance: number };

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.attendance = new Map();
    this.currentId = { users: 1, projects: 1, attendance: 1 };

    // Seed initial data
    const defaultUsers = [
      { name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John", username: "john" },
      { name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane", username: "jane" },
      { name: "Mike Anderson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike", username: "mike" },
      { name: "Linda Williams", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linda", username: "linda" },
    ];

    defaultUsers.forEach(user => {
      this.createUser({ ...user, password: "password123" });
    });

    const defaultProjects = [
      { name: "Survey Design", tag: "Research", description: "Crafting clear, unbiased questions is essential for effective survey design." },
      { name: "SWOT Analysis", tag: "Strategy", description: "Identify strengths, weaknesses, opportunities, and threats for strategic insights." },
      { name: "Structure Design", tag: "Operations", description: "Efficient structure design ensures stability, functionality, and aesthetic appeal." },
    ];

    defaultProjects.forEach(project => {
      const id = this.currentId.projects++;
      this.projects.set(id, { ...project, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async checkIn(userId: number, notes?: string): Promise<Attendance> {
    const id = this.currentId.attendance++;
    const record: Attendance = {
      id,
      userId,
      checkIn: new Date(),
      checkOut: null,
      notes: notes || null,
    };
    this.attendance.set(id, record);
    return record;
  }

  async checkOut(userId: number): Promise<Attendance | undefined> {
    const current = await this.getCurrentAttendance(userId);
    if (!current) return undefined;

    const updated = { ...current, checkOut: new Date() };
    this.attendance.set(current.id, updated);
    return updated;
  }

  async getCurrentAttendance(userId: number): Promise<Attendance | undefined> {
    return Array.from(this.attendance.values()).find(
      record => record.userId === userId && !record.checkOut
    );
  }

  async getAttendanceHistory(userId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values())
      .filter(record => record.userId === userId)
      .sort((a, b) => b.checkIn.getTime() - a.checkIn.getTime());
  }
}

export const storage = new MemStorage();
