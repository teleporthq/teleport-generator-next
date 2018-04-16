import { ProjectGenerator, RenderResult } from '../../teleport-lib-js';
import TeleportGeneratorNext from '../index';
import NextComponentGenerator from './component';
export default class ReactProjectGenerator extends ProjectGenerator {
    generator: TeleportGeneratorNext;
    componentGenerator: NextComponentGenerator;
    constructor(generator: TeleportGeneratorNext, componentGenerator: NextComponentGenerator);
    generate(project: any, options?: any): RenderResult;
    publish(path: string, archive?: boolean): void;
}
