const httpStatusCodes: ITypeHttpStatusCodes = {
  Created: 201,
};


const errRes = {
  DATA_NOT_FOUND: (body: {
    [key: string]: object | string | null | number | boolean;
  }) => ({
    code: 404,
    status: 4041,
    error: body,
    payload: null,
  }),
  INTERNAL_SERVER_ERROR: (body: { message: string; payload?: any }) => ({
    code: 500,
    status: 5001,
    error: body,
    payload: null,
  }),
  BAD_REQUEST: (body: { message: string }) => ({
    code: 400,
    status: 4001,
    error: body,
    payload: null,
  }),
  FORBIDDEN: (body: { message: string }) => ({
    code: 403,
    status: 4031,
    error: body,
    payload: null,
  }),
};
function successRes<T = null>(payload: T): ITypeSuccess<T> {
  return {
    code: httpStatusCodes.Created,
    status: 2001,
    error: null,
    payload,
  };
}


export { errRes, successRes, httpStatusCodes };
