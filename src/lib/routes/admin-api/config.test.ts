import supertest, { Test } from 'supertest';
import { createTestConfig } from '../../../test/config/test-config';

import createStores from '../../../test/fixtures/store';
import getApp from '../../app';
import { createServices } from '../../services';
import {
    DEFAULT_SEGMENT_VALUES_LIMIT,
    DEFAULT_STRATEGY_SEGMENTS_LIMIT,
} from '../../util/segments';
import TestAgent from 'supertest/lib/agent';

const uiConfig = {
    headerBackground: 'red',
    slogan: 'hello',
};

async function getSetup() {
    const base = `/random${Math.round(Math.random() * 1000)}`;
    const config = createTestConfig({
        server: { baseUriPath: base },
        ui: uiConfig,
    });
    const stores = createStores();
    const services = createServices(stores, config);

    const app = await getApp(config, stores, services);

    return {
        base,
        request: supertest(app),
    };
}

let request: TestAgent<Test>;
let base: string;

beforeEach(async () => {
    const setup = await getSetup();
    request = setup.request;
    base = setup.base;
});

test('should get ui config', async () => {
    const { body } = await request
        .get(`${base}/api/admin/ui-config`)
        .expect('Content-Type', /json/)
        .expect(200);

    expect(body.slogan).toEqual('hello');
    expect(body.headerBackground).toEqual('red');
    expect(body.segmentValuesLimit).toEqual(DEFAULT_SEGMENT_VALUES_LIMIT);
    expect(body.strategySegmentsLimit).toEqual(DEFAULT_STRATEGY_SEGMENTS_LIMIT);
});
