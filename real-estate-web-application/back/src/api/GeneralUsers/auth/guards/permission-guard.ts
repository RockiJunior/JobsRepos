import * as jwt from 'jsonwebtoken';
import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { PermissionEnumList, TypeOfUser } from '../../../../config/enum-types';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly _reflector: Reflector
	) {}

	public async canActivate(context: ExecutionContext): Promise<any> {
		const permissions: PermissionEnumList[] = this._reflector.get<
			PermissionEnumList[]
		>('permissions', context.getHandler());

		if (!permissions) {
			return true;
		}
		try {
			const request = context.switchToHttp().getRequest();
			const auth = request.headers.authorization;
			if (!auth) {
				return false;
			}
			const token = auth.split(' ')[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			request.user = decoded;
			const permissionsList = await this.authService.getPermissionsUser(
				request.user.id
			);
			if (
				request.user.typeOfUser === TypeOfUser.adminUser &&
				permissionsList.length === 0
			) {
				return true;
			} else if (permissionsList.length > 0) {
				return permissionsList.some((perm: any) => {
					return permissions.includes(perm);
				});
			}
		} catch (err) {
			return err;
		}
	}
}
