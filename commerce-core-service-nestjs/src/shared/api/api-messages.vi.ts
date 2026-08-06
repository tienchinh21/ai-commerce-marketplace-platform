import { ApiErrorCode } from './api-error-code';

export const VI_API_MESSAGES = {
  errors: {
    [ApiErrorCode.AUTH_INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng.',
    [ApiErrorCode.AUTH_USER_NOT_FOUND]: 'Không tìm thấy người dùng đăng nhập.',
    [ApiErrorCode.AUTH_UNAUTHORIZED]:
      'Bạn cần đăng nhập để thực hiện thao tác này.',
    [ApiErrorCode.AUTH_FORBIDDEN]:
      'Bạn không có quyền thực hiện thao tác này.',
    [ApiErrorCode.USER_NOT_FOUND]: 'Không tìm thấy người dùng.',
    [ApiErrorCode.USER_EMAIL_EXISTS]: 'Email đã tồn tại.',
    [ApiErrorCode.CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục.',
    [ApiErrorCode.CATEGORY_ATTRIBUTE_NOT_FOUND]:
      'Không tìm thấy thuộc tính danh mục.',
    [ApiErrorCode.PRODUCT_NOT_FOUND]: 'Không tìm thấy sản phẩm.',
    [ApiErrorCode.SELLER_NOT_FOUND]: 'Không tìm thấy nhà bán hàng.',
    [ApiErrorCode.BUYER_NOT_FOUND]: 'Không tìm thấy người mua.',
    [ApiErrorCode.REVIEW_NOT_FOUND]: 'Không tìm thấy đánh giá.',
    [ApiErrorCode.ORDER_NOT_FOUND]: 'Không tìm thấy đơn hàng.',
    [ApiErrorCode.DATA_SOURCE_NOT_FOUND]: 'Không tìm thấy nguồn dữ liệu.',
    [ApiErrorCode.SYNC_RUN_NOT_FOUND]: 'Không tìm thấy lượt đồng bộ.',
    [ApiErrorCode.RAW_SNAPSHOT_NOT_FOUND]:
      'Không tìm thấy bản ghi dữ liệu thô.',
    [ApiErrorCode.VALIDATION_FAILED]: 'Dữ liệu gửi lên không hợp lệ.',
    [ApiErrorCode.INVALID_UUID]: 'Mã định danh không hợp lệ.',
    [ApiErrorCode.DATABASE_CONFLICT]: 'Dữ liệu đã tồn tại hoặc bị trùng.',
    [ApiErrorCode.DATABASE_RELATION_NOT_FOUND]:
      'Dữ liệu liên quan không tồn tại.',
    [ApiErrorCode.DATABASE_REQUIRED_FIELD_MISSING]:
      'Thiếu dữ liệu bắt buộc.',
    [ApiErrorCode.INTERNAL_SERVER_ERROR]:
      'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
  },
  success: {
    USER_CREATED: 'Tạo người dùng thành công.',
    USER_PERMISSIONS_UPDATED: 'Cập nhật quyền người dùng thành công.',
    CATEGORY_CREATED: 'Tạo danh mục thành công.',
    CATEGORY_UPDATED: 'Cập nhật danh mục thành công.',
    CATEGORY_DELETED: 'Xóa danh mục thành công.',
    CATEGORY_ATTRIBUTE_CREATED: 'Tạo thuộc tính danh mục thành công.',
    CATEGORY_ATTRIBUTE_UPDATED: 'Cập nhật thuộc tính danh mục thành công.',
    CATEGORY_ATTRIBUTE_DELETED: 'Xóa thuộc tính danh mục thành công.',
    PRODUCT_CREATED: 'Tạo sản phẩm thành công.',
    PRODUCT_UPDATED: 'Cập nhật sản phẩm thành công.',
    PRODUCT_DELETED: 'Xóa sản phẩm thành công.',
    PRODUCT_VARIANT_CREATED: 'Tạo biến thể sản phẩm thành công.',
    PRODUCT_IMAGES_ADDED: 'Thêm hình ảnh sản phẩm thành công.',
    SELLER_CREATED: 'Tạo nhà bán hàng thành công.',
    SELLER_UPDATED: 'Cập nhật nhà bán hàng thành công.',
    BUYER_CREATED: 'Tạo người mua thành công.',
    BUYER_UPDATED: 'Cập nhật người mua thành công.',
    REVIEW_CREATED: 'Tạo đánh giá thành công.',
    REVIEW_UPDATED: 'Cập nhật đánh giá thành công.',
    ORDER_CREATED: 'Tạo đơn hàng thành công.',
    DATA_SOURCE_CREATED: 'Tạo nguồn dữ liệu thành công.',
    DATA_SOURCE_UPDATED: 'Cập nhật nguồn dữ liệu thành công.',
    IMPORT_PRODUCTS_COMPLETED: 'Nhập sản phẩm hoàn tất.',
    IMPORT_PRODUCTS_COMPLETED_WITH_ERRORS:
      'Nhập sản phẩm hoàn tất nhưng có lỗi.',
    IMPORT_REVIEWS_COMPLETED: 'Nhập đánh giá hoàn tất.',
    IMPORT_REVIEWS_COMPLETED_WITH_ERRORS:
      'Nhập đánh giá hoàn tất nhưng có lỗi.',
  },
} as const;
