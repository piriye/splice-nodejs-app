import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class WhereLike extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'where_like';
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "where_like=name:moet"
    public async addQuery(model, parameter) {
        const queryParameters = parameter.split(',');

        for (const queryKey in queryParameters) {
            const queryParameter = queryParameters[queryKey];
            const result = queryParameter.split(':');
            
            model.where(result[0], 'ilike',  `%${result[1]}%`);
        }

        return model;
    }
}

export default WhereLike;
