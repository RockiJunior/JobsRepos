import { SetMetadata } from '@nestjs/common';
import { PermissionEnumList } from '../../../../config/enum-types';

export const CheckPermissions = (...permissions: PermissionEnumList[]) =>
	SetMetadata('permissions', permissions);
