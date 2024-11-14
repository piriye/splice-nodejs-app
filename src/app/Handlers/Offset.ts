import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class Offset extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'offset';
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "offset=20"
    public async addQuery(model, parameter) {
        model.offset(parameter);
        return model;
    }
}

export default Offset;
