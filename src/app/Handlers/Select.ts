import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class Select extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'select';
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "select=full_name,email"
    public async addQuery(model, parameter) {
        const result = parameter.split(',');
        
        model.select(result);

        return model;
    }
}

export default Select;
