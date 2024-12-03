import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { SecurityServiceImpl } from "../services/impl/security.service.impl";

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
    const token = inject(SecurityServiceImpl).getAuthToken();
    
    if (token != null){
        const req = request.clone({
            headers: request.headers.set(
                "Authorization",
                `Bearer ${localStorage.getItem('token')}`
            ),
        });
        return next(req);
    }
    return next(request.clone());
};