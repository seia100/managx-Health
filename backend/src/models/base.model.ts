// src/models/base.model.ts
import { Pool, QueryResult } from 'pg';
import { db } from '../config/database';
import { BaseModel, CrudOperations, QueryResultRow } from './types';
import { DatabaseError } from '../utils/errors';
import { logger } from '../utils/logger';

export abstract class Model<T extends BaseModel> implements CrudOperations<T> {
    protected readonly pool: Pool;
    protected readonly tableName: string;

    constructor(tableName: string) {
        this.pool = db.getPool();
        this.tableName = tableName;
    }

    protected async executeQuery<R extends QueryResultRow>(
        query: string,
        params: any[] = []
    ): Promise<QueryResult<R>> {
        if (!query) {
            throw new Error('Query no puede estar vacío');
        }
    
        try {
            const result = await this.pool.query<R>(query, params);
            return result;
        } catch (error) {
            logger.error(`Error ejecutando query en ${this.tableName}:`, error);
            throw new DatabaseError(
                `Error en operación de base de datos: ${error}`
            );
        }
    }

    public async create(data: Partial<T>): Promise<T> {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        
        const query = `
            INSERT INTO ${this.tableName} 
            (${columns.join(', ')}) 
            VALUES (${placeholders})
            RETURNING *
        `;

        const result = await this.executeQuery<QueryResultRow<T>>(query, values);
        return result.rows[0];
    }

    public async findById(id: string): Promise<T | null> {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE id = $1
        `;

        const result = await this.executeQuery<QueryResultRow<T>>(query, [id]);
        return result.rows[0] || null;
    }

    public async update(id: string, data: Partial<T>): Promise<T | null> {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const setClause = columns
            .map((col, i) => `${col} = $${i + 2}`)
            .join(', ');

        const query = `
            UPDATE ${this.tableName}
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
        `;

        const result = await this.executeQuery<QueryResultRow<T>>(
            query,
            [id, ...values]
        );
        return result.rows[0] || null;
    }

    public async delete(id: string): Promise<boolean> {
        const query = `
            DELETE FROM ${this.tableName}
            WHERE id = $1
            RETURNING id
        `;
    
        const result = await this.executeQuery<QueryResultRow<T>>(query, [id]);
        return result.rowCount !== null && result.rowCount > 0;
    }
    
}