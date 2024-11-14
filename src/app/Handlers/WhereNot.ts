import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class WhereNot extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'where_not'
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "where_not=status:paid"
    public async addQuery(model, parameter) {
        const queryParameters = parameter.split(',');

        for (const queryKey in queryParameters) {
            const queryParameter = queryParameters[queryKey];
            const result = queryParameter.split(':');
            
            model.whereNot(result[0], result[1]);
        }

        return model;
    }
}

export default WhereNot;
