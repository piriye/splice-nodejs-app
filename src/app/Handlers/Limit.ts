import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class Limit extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'limit';
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "limit=10"
    public async addQuery(model, parameter) {
        model.limit(parameter);
        return model;
    }
}

export default Limit;
