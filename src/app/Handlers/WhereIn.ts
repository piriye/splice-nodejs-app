import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class WhereIn extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'where_in'
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "where_in=customer_id:d93a2b57-add9-433d-ae82-20e55c2b8631,ad1566b1-6fb5-4f25-ab9b-5bed8f6e56b2"
    public async addQuery(model, parameter) {
        const queryParameters = parameter.split(':');
        const resultsToFind = queryParameters[1].split(',');

        model.whereIn(queryParameters[0], resultsToFind);

        return model;
    }
}

export default WhereIn;
