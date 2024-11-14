import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class Preload extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'preload'
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "preload=group,customer"
    public async addQuery(model, parameter) {
        const preloadParameters = parameter.split(',');

        for (const preloadParameter of preloadParameters) {
            model.preload(preloadParameter);
        }

        return model;
    }
}

export default Preload;
