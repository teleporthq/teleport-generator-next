import { ComponentGenerator, RenderResult } from '../../teleport-lib-js';
import TeleportGeneratorNext from '../index';
export default class NextComponentGenerator extends ComponentGenerator {
    generator: TeleportGeneratorNext;
    constructor(generator: TeleportGeneratorNext);
    processStyles(componentContent: any, styles: any): any;
    computeDependencies(content: any): any;
    renderComponentJSX(content: any, isRoot?: boolean, styles?: any): any;
    generate(component: any, options?: any): RenderResult;
}
