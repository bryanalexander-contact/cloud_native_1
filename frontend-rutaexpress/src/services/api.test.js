import { describe, it, expect, vi } from 'vitest';
import api from './api';

describe('API Interceptor', () => {
    it('should be defined', () => {
        expect(api).toBeDefined();
    });

    it('should have baseURL defined or default', () => {
        expect(api.defaults.baseURL).toBeDefined();
    });
});
