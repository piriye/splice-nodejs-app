import { QueryBuilderInterface } from "App/Interfaces/QueryBuilderInterface";
import BaseHandler from "./BaseHandler";

class OrderBy extends BaseHandler implements QueryBuilderInterface {
    public typeName: string;

    constructor() {
        const typeName = 'order_by'
        super(typeName);
        this.typeName = typeName;
    }

    // parameter => "order_by=order:desc"
    public async addQuery(model, parameter) {
        const result = parameter.split(':');
        model.orderBy(result[0], result[1]);

        return model;
    }
}

export default OrderBy;
