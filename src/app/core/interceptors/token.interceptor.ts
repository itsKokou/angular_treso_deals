import { HttpInterceptorFn } from "@angular/common/http";

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
    const req = request.clone({
        headers: request.headers.set(
            "Authorization",
            `Bearer ${localStorage.getItem('token')}`
        ),
    });
    return next(req);
};