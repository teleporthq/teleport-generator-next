import { Target, Generator, RenderResult } from '../teleport-lib-js';
import NextComponentGenerator from './generators/component';
import NextProjectGenerator from './generators/project';
export default class TeleportGeneratorNext extends Generator {
    name: string;
    type: string;
    targetName: string;
    target: Target;
    componentGenerator: NextComponentGenerator;
    projectGenerator: NextProjectGenerator;
    constructor();
    generateComponent(component: any, options: any): RenderResult;
    generateProject(component: any, options: any): RenderResult;
}
