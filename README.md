# NestJS Tutorial & Architecture Handbook: Sun* Training Guideline

> **Dự án thực hành và cẩm nang kiến thức NestJS**, được xây dựng chuẩn mực theo giáo trình đào tạo tại Sun Asterisk ([Training-Guideline / Nodejs / tutorial.md](https://github.com/framgia/Training-Guideline/blob/master/Nodejs/tutorial.md)) và [NestJS Official Documentation](https://docs.nestjs.com/).
>
> 🎯 **Quy trình nộp bài:** Quản lý và theo dõi tiến độ qua các **Pull Requests (PR)** hàng ngày:
> 1. Tạo branch tính năng tương ứng.
> 2. Request Copilot review + fix comment + self-review.
> 3. Gửi link Pull Request vào Thread Slack/Chatwork cho Mentor/Trainer (**Pham Thanh Binh**) review.

---

## 📌 Lộ Trình Pull Requests (Tutorial Roadmap)

| PR # | Nhánh (Branch) | Nội dung công việc | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Pull 1** | `pull-1-init-project-i18n-swagger` | Khởi tạo dự án NestJS + 1 API Hello World + Cấu hình đa ngôn ngữ `nestjs-i18n` + Tài liệu tương tác Swagger OpenAPI (`/api/docs`) |  **HOÀN THÀNH** |
| **Pull 2** | `pull-2-manual-migration-auth-redis` | Thiết lập Migration Database thủ công (TypeORM) + Xử lý Authentication (Register, Login, Logout dùng Redis lưu blacklist token, Get Current User) | ⏳ *Kế tiếp* |
| **Pull 3** | `pull-3-crud-restful-api` | Triển khai các API CRUD chuẩn RESTful + Format response bằng Serializer + Validate DTO + Search, Filter, Pagination | ⏳ *Kế tiếp* |
| **Pull 4** | `pull-4-file-upload-multer` | Xử lý upload file đa phương tiện với Multer & Cloudinary lưu trữ ảnh | ⏳ *Kế tiếp* |
| **Pull 5** | `pull-5-mailer-bull-schedule` | Gửi mail bất đồng bộ với `@nestjs/bull` (Redis Queue) và lập lịch định kỳ với `@nestjs/schedule` | ⏳ *Kế tiếp* |

---

## 🌟 Chi Tiết Triển Khai Pull 1

### 1. Cấu hình Đa ngôn ngữ Quốc tế hóa (`nestjs-i18n`)
- Hỗ trợ đa ngôn ngữ với các file JSON định nghĩa bản dịch tại thư mục `src/i18n/`:
  - `en/app.json`: Bản dịch tiếng Anh (mặc định)
  - `vi/app.json`: Bản dịch tiếng Việt
  - `ja/app.json`: Bản dịch tiếng Nhật
- Cơ chế nhận diện ngôn ngữ linh hoạt qua các Resolver:
  - Query param: `?lang=vi` hoặc `?l=vi`
  - Header: `x-custom-lang: vi`
  - Header chuẩn: `Accept-Language: vi-VN,vi;q=0.9`

### 2. Cấu hình Swagger OpenAPI (`/api/docs`)
- Sử dụng `@nestjs/swagger` và `swagger-ui-express`.
- Tự động sinh tài liệu API trực quan tại: `http://localhost:3000/api/docs`.
- Tích hợp sẵn BearerAuth (`JWT-auth`) phục vụ cho các Pull tiếp theo.

### 3. API Hello World Đa Ngôn Ngữ (`GET /api/v1/hello`)
- Endpoint: `GET /api/v1/hello`
- Hỗ trợ query param `lang` (`en`, `vi`, `ja`).
- Phản hồi mẫu khi gọi tiếng Việt:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "timestamp": "2026-11-09T07:58:00.000Z",
    "data": {
      "message": "Xin chào thế giới!",
      "welcome": "Chào mừng bạn đến với khóa học NestJS Tutorial!",
      "description": "Tính năng đa ngôn ngữ (i18n) và Swagger đã được thiết lập thành công.",
      "currentLanguage": "vi",
      "timestamp": "2026-11-09T07:58:00.000Z"
    }
  }
  ```

---

## 📑 Mục Lục
1. [First Steps (Những bước đầu tiên & Cơ chế Bootstrap)](#1-first-steps-những-bước-đầu-tiên)
2. [Controllers (Bộ điều hướng & Định tuyến Request)](#2-controllers-bộ-điều-hướng)
3. [Providers & Dependency Injection (Nhà cung cấp & Tiêm phụ thuộc)](#3-providers--dependency-injection)
4. [Modules (Mô-đun hóa kiến trúc ứng dụng)](#4-modules-mô-đun-hóa-kiến-trúc)
5. [Middleware (Phần mềm trung gian)](#5-middleware-phần-mềm-trung-gian)
6. [Exception Filters (Bộ lọc ngoại lệ chuẩn hóa)](#6-exception-filters-bộ-lọc-ngoại-lệ)
7. [Pipes (Ống xử lý biến đổi & Xác thực dữ liệu)](#7-pipes-ống-xử-lý-biến-đổi--xác-thực)
8. [Guards (Lớp bảo vệ & Phân quyền truy cập)](#8-guards-lớp-bảo-vệ--phân-quyền)
9. [Interceptors (Bộ chặn & Biến đổi luồng RxJS)](#9-interceptors-bộ-chặn--biến-đổi-luồng-rxjs)
10. [Custom Decorators (Bộ trang trí tùy biến)](#10-custom-decorators-bộ-trang-trí-tùy-biến)
11. [Request Lifecycle (Vòng đời hoàn chỉnh của một Request)](#11-request-lifecycle-trong-nestjs)
12. [Hướng dẫn Cài đặt, Khởi chạy & Kiểm thử Dự án](#12-hướng-dẫn-cài-đặt-khởi-chạy--kiểm-thử)

---

## 1. First Steps (Những bước đầu tiên)

### 1.1. NestJS là gì?
NestJS là một framework Node.js tiến bộ (progressive) dùng để xây dựng các ứng dụng server-side hiệu quả, đáng tin cậy và có khả năng mở rộng cao (Enterprise-grade applications).
- **Ngôn ngữ:** Hỗ trợ và được xây dựng 100% bằng **TypeScript** (vẫn cho phép viết JavaScript thuần).
- **Kiến trúc:** Kết hợp các yếu tố tinh hoa từ **OOP** (Object Oriented Programming), **FP** (Functional Programming) và **FRP** (Functional Reactive Programming).
- **Nền tảng hạ tầng:** Mặc định sử dụng **Express** làm HTTP server engine, nhưng có thể dễ dàng chuyển đổi sang **Fastify** để đạt hiệu năng tối đa.

```text
+-------------------------------------------------------+
|                     NestJS Framework                  |
|    (Controllers, Providers, Modules, Guards, Pipes)   |
+-------------------------------------------------------+
|       HTTP Adapter (Express Engine / Fastify)         |
+-------------------------------------------------------+
|                    Node.js Runtime                    |
+-------------------------------------------------------+
```

### 1.2. Khởi tạo dự án với Nest CLI
```bash
# Cài đặt Nest CLI trên toàn hệ thống
npm install -g @nestjs/cli

# Khởi tạo dự án mới
nest new project-name
```

### 1.3. Cấu trúc tệp tin khởi đầu (Scaffold Files)
| File | Vai trò |
| :--- | :--- |
| `main.ts` | Entry point của ứng dụng. Sử dụng `NestFactory.create()` để bootstrap server. |
| `app.module.ts` | Root Module (mô-đun gốc) định nghĩa toàn bộ cây phụ thuộc của dự án. |
| `app.controller.ts` | Controller cơ bản với một route duy nhất. |
| `app.service.ts` | Service cung cấp dữ liệu cơ bản cho `AppController`. |
| `app.controller.spec.ts` | Unit test mẫu cho controller. |

### 1.4. Quá trình Bootstrap trong `main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Khởi tạo instance ứng dụng dựa trên AppModule
  const app = await NestFactory.create(AppModule);

  // Thiết lập tiền tố toàn cục cho mọi API: /api/v1/...
  app.setGlobalPrefix('api/v1');

  // Bật CORS cho phép các frontend khác nguồn truy cập
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
```

---

## 2. Controllers (Bộ điều hướng)

### 2.1. Vai trò của Controller
Controller chịu trách nhiệm xử lý các **Request** gửi đến từ Client và trả về **Response**. Cơ chế định tuyến (Routing) quyết định Controller nào sẽ tiếp nhận request tương ứng.

```text
HTTP Request ---> [Routing System] ---> Controller ---> Service (Business Logic)
                                            |
HTTP Response <-----------------------------+
```

### 2.2. Khai báo Route & HTTP Methods
Sử dụng decorator `@Controller('tên_tài_nguyên')` để nhóm các route:
```typescript
import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateItemDto, UpdateItemDto } from './dto';

@Controller('items')
export class ItemsController {
  // GET /items
  @Get()
  findAll(@Query('search') search?: string) {
    return `Trả về danh sách items, từ khóa tìm kiếm: ${search}`;
  }

  // GET /items/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Lấy chi tiết item mang ID = ${id}`;
  }

  // POST /items
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateItemDto) {
    return { message: 'Tạo mới thành công', data: createDto };
  }

  // PUT /items/:id (Ghi đè toàn bộ)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateItemDto) {
    return `Thay thế toàn bộ item ${id}`;
  }

  // DELETE /items/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    // Trả về 204 No Content
  }
}
```

### 2.3. Bảng tổng hợp Decorators trong Request
| NestJS Decorator | Đối tượng tương ứng trong Express | Ý nghĩa |
| :--- | :--- | :--- |
| `@Req()` | `req` | Toàn bộ đối tượng HTTP Request |
| `@Res()` | `res` | Đối tượng Response (chỉ dùng khi cần can thiệp cấp thấp) |
| `@Param(key?: string)` | `req.params` / `req.params[key]` | Trích xuất Path parameter từ URL (`:id`) |
| `@Body(key?: string)` | `req.body` / `req.body[key]` | Trích xuất payload từ Request Body |
| `@Query(key?: string)` | `req.query` / `req.query[key]` | Trích xuất Query params sau dấu `?` |
| `@Headers(name?: string)`| `req.headers` | Trích xuất HTTP Headers gửi kèm |
| `@Ip()` | `req.ip` | Địa chỉ IP của client |

---

## 3. Providers & Dependency Injection

### 3.1. Khái niệm Provider & IoC Container
Hầu hết các class cơ bản trong NestJS như Service, Repository, Factory, Helper đều có thể được coi là **Provider**.
Ý tưởng cốt lõi: Provider có thể được **tiêm (Injected)** như một phụ thuộc vào các class khác thông qua cơ chế **Dependency Injection (DI)**. NestJS sở hữu một **IoC Container (Inversion of Control)** quản lý toàn bộ vòng đời khởi tạo và mối quan hệ giữa các object này.

### 3.2. Khai báo Service với `@Injectable()`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

export interface Item {
  id: number;
  title: string;
  price: number;
}

@Injectable()
export class ItemsService {
  private readonly items: Item[] = [];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: number): Item {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundException(`Item có ID #${id} không tồn tại.`);
    }
    return item;
  }

  create(item: Omit<Item, 'id'>): Item {
    const newItem = { id: Date.now(), ...item };
    this.items.push(newItem);
    return newItem;
  }
}
```

### 3.3. Tiêm phụ thuộc qua Constructor (Constructor Injection)
NestJS tự động phân tích kiểu dữ liệu TypeScript trong constructor để tiêm đúng instance tương ứng:
```typescript
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  getAll() {
    return this.itemsService.findAll();
  }
}
```

### 3.4. Các kỹ thuật Custom Provider nâng cao
Ngoài việc khai báo trực tiếp tên class trong mảng `providers`, NestJS hỗ trợ nhiều dạng provider linh hoạt:
```typescript
@Module({
  providers: [
    // 1. Standard provider (viết tắt)
    ItemsService,

    // 2. Value Provider (useValue): Tiêm hằng số hoặc cấu hình
    {
      provide: 'APP_CONFIG',
      useValue: { apiUrl: 'https://api.sun-asterisk.com', timeout: 5000 },
    },

    // 3. Class Provider (useClass): Hoán đổi triển khai linh hoạt (Mocking trong test)
    {
      provide: ItemsService,
      useClass: process.env.NODE_ENV === 'test' ? MockItemsService : ItemsService,
    },

    // 4. Factory Provider (useFactory): Khởi tạo bất đồng bộ hoặc phụ thuộc động
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async (config: ConfigService) => {
        return await createDatabaseConnection(config.getDbUri());
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
```

---

## 4. Modules (Mô-đun hóa kiến trúc)

### 4.1. Vai trò của Module
Module là lớp đóng gói logic chức năng, giúp chia nhỏ ứng dụng thành các khối nghiệp vụ riêng biệt, có ranh giới rõ ràng.
Mỗi ứng dụng NestJS có ít nhất một **Root Module** (`AppModule`).

```text
                        +---------------+
                        |   AppModule   | (Root)
                        +-------+-------+
                                |
             +------------------+------------------+
             |                                     |
     +-------v-------+                     +-------v-------+
     |  UsersModule  |                     |  ItemsModule  |
     +---------------+                     +---------------+
```

### 4.2. Bốn thuộc tính cốt lõi của `@Module()`
```typescript
import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [],               // Các module khác mà module này phụ thuộc vào
  controllers: [ItemsController], // Danh sách controllers khởi tạo trong module này
  providers: [ItemsService], // Danh sách providers do IoC container tạo
  exports: [ItemsService],   // Cho phép các module khác import module này dùng được ItemsService
})
export class ItemsModule {}
```

### 4.3. Global Modules (`@Global()`)
Khi muốn một module (ví dụ: `DatabaseModule`, `ConfigModule`) có sẵn ở mọi nơi trong toàn bộ ứng dụng mà không cần phải `imports: [ConfigModule]` lặp lại nhiều lần, hãy dùng `@Global()`:
```typescript
@Global()
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

---

## 5. Middleware (Phần mềm trung gian)

### 5.1. Khái niệm Middleware
Middleware là hàm được thực thi **trước** khi Request đến được Route Handler. Middleware có quyền:
- Thực thi bất kỳ đoạn mã lệnh nào.
- Thay đổi đối tượng `Request` và `Response`.
- Kết thúc chu trình request-response.
- Gọi hàm `next()` để chuyển sang middleware tiếp theo trong chuỗi.

### 5.2. Triển khai Class Middleware (`NestMiddleware`)
```typescript
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(`[${method}] ${originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });

    next();
  }
}
```

### 5.3. Đăng ký Middleware với `MiddlewareConsumer`
Module chứa middleware phải implement interface `NestModule`:
```typescript
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

@Module({ ... })
export class ItemsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'items/health', method: RequestMethod.GET }) // Loại trừ route
      .forRoutes('items'); // Áp dụng cho mọi route /items
  }
}
```

---

## 6. Exception Filters (Bộ lọc ngoại lệ)

### 6.1. Cơ chế bắt lỗi tích hợp của NestJS
NestJS tích hợp sẵn một **Exceptions Layer** toàn cầu chịu trách nhiệm bắt mọi ngoại lệ chưa được xử lý. Khi gặp lỗi không được bắt, lớp này tự động phản hồi mã `500 Internal Server Error`.

### 6.2. Các Built-in HTTP Exceptions
NestJS cung cấp sẵn tập hợp các Exception chuẩn kế thừa từ `HttpException`:
- `BadRequestException` (400)
- `UnauthorizedException` (401)
- `ForbiddenException` (403)
- `NotFoundException` (404)
- `ConflictException` (409)
- `UnprocessableEntityException` (422)
- `InternalServerErrorException` (500)

```typescript
throw new NotFoundException('Không tìm thấy bản ghi yêu cầu');
```

### 6.3. Xây dựng Custom Exception Filter
Định dạng lại toàn bộ phản hồi lỗi về một cấu trúc JSON đồng nhất:
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const resBody: any = exception.getResponse();

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof resBody === 'object' ? resBody.message || resBody : resBody,
    });
  }
}
```

### 6.4. Đăng ký Exception Filter
- **Toàn cục (Global) trong `main.ts`:**
  ```typescript
  app.useGlobalFilters(new HttpExceptionFilter());
  ```
- **Cấp Controller hoặc Method:**
  ```typescript
  @UseFilters(HttpExceptionFilter)
  @Get()
  findAll() { ... }
  ```

---

## 7. Pipes (Ống xử lý biến đổi & Xác thực)

### 7.1. Hai vai trò sống còn của Pipe
1. **Transformation (Chuyển đổi):** Biến đổi dữ liệu đầu vào sang kiểu mong muốn (ví dụ: chuỗi `"123"` thành số `123`).
2. **Validation (Xác thực):** Kiểm tra tính hợp lệ của dữ liệu đầu vào. Nếu dữ liệu sai quy chuẩn, lập tức ném ra ngoại lệ ngăn chặn handler thực thi.

### 7.2. Các Built-in Pipes thông dụng
- `ParseIntPipe`: Chuyển chuỗi sang số nguyên `number`.
- `ParseFloatPipe`: Chuyển chuỗi sang số thực.
- `ParseBoolPipe`: Chuyển chuỗi (`'true'` / `'false'`) sang `boolean`.
- `ParseUUIDPipe`: Kiểm tra định dạng chuẩn UUID.
- `ValidationPipe`: Xác thực tự động DTO kết hợp `class-validator`.

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  // id được đảm bảo 100% là number lúc này
  return typeof id; // "number"
}
```

### 7.3. Tạo Custom Pipe
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(`Giá trị '${value}' phải là một số nguyên dương (> 0).`);
    }
    return val;
  }
}
```

---

## 8. Guards (Lớp bảo vệ & Phân quyền)

### 8.1. Guard vs Middleware
| Tiêu chí | Middleware | Guard |
| :--- | :--- | :--- |
| **Phạm vi nhận biết** | "Mù" ngữ cảnh thực thi kế tiếp | Có quyền truy cập `ExecutionContext` |
| **Biết trước Handler** | Không thể biết route handler nào sắp chạy | Biết chính xác Class và Method sắp được gọi |
| **Mục đích chính** | Logging, nén gzip, gán session | **Xác thực (Authentication) & Phân quyền (Authorization)** |

### 8.2. Triển khai Guard với `CanActivate`
Một Guard bắt buộc phải triển khai hàm `canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>`.
- Trả về `true`: Request được phép đi tiếp vào Controller.
- Trả về `false`: NestJS tự động chặn request và trả về `403 Forbidden`.

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Đọc metadata danh sách role yêu cầu từ decorator @Roles()
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const token = request.headers['x-auth-token'];
    if (!token) throw new UnauthorizedException('Thiếu x-auth-token xác thực.');

    const userRole = request.headers['x-user-role'] || 'trainee';
    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException(`Yêu cầu role [${requiredRoles.join(', ')}]. Role của bạn: ${userRole}`);
    }

    return true;
  }
}
```

---

## 9. Interceptors (Bộ chặn & Biến đổi luồng RxJS)

### 9.1. Lập trình Hướng khía cạnh (AOP - Aspect-Oriented Programming)
Interceptor lấy cảm hứng từ kỹ thuật AOP, cho phép can thiệp vào trước và sau chu trình thực thi hàm:
- Thêm logic bổ sung trước / sau khi method thực thi.
- Biến đổi (Transform) kết quả trả về của hàm.
- Biến đổi (Transform) ngoại lệ ném ra từ hàm.
- Mở rộng hành vi cơ bản (ví dụ: Đo thời gian chạy, Cache kết quả).

### 9.2. Đo thời gian thực thi với `LoggingInterceptor`
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('LoggingInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const handler = context.getHandler().name;

    // next.handle() gọi tiếp Route Handler và trả về một RxJS Observable
    return next.handle().pipe(
      tap(() => this.logger.log(`Hàm ${handler}() thực thi xong trong: ${Date.now() - now}ms`)),
    );
  }
}
```

### 9.3. Biến đổi dữ liệu trả về với `TransformInterceptor`
Tự động bọc toàn bộ dữ liệu trả về vào định dạng `{ success: true, statusCode, data: ... }`:
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: res.statusCode,
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
```

---

## 10. Custom Decorators (Bộ trang trí tùy biến)

### 10.1. Tại sao cần Custom Decorator?
Trong JavaScript/TypeScript hiện đại, Decorators là các hàm tiền xử lý được gắn vào class, method hoặc tham số. NestJS cho phép tạo các Decorator tùy biến giúp mã nguồn ngắn gọn, tường minh và loại bỏ code lặp lại.

### 10.2. Tạo Param Decorator với `createParamDecorator`
Trích xuất thông tin người dùng từ Request object:
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (property: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user || { id: 1, name: 'Minh Nhat', role: 'admin' };
    return property ? user?.[property] : user;
  },
);
```

Sử dụng trực tiếp trong Controller:
```typescript
@Get('profile')
getProfile(@User() user: any, @User('name') name: string) {
  return { user, name };
}
```

### 10.3. Tạo Custom Metadata Decorator
```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```
Sử dụng:
```typescript
@Post()
@Roles('admin', 'manager')
createItem() { ... }
```

---

## 11. Request Lifecycle trong NestJS

Khi một HTTP Request gửi đến ứng dụng NestJS, nó sẽ di chuyển qua các tầng theo thứ tự nghiêm ngặt sau đây:

```text
               +-------------------------------------------------------+
               |                  1. Incoming Request                  |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |               2. Globally Bound Middleware            |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |               3. Module Bound Middleware              |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |             4. Guards (Global -> Controller -> Route)  |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |         5. Interceptors (Pre-controller logic)        |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |             6. Pipes (Global -> Controller -> Route)   |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |         7. Route Handler Execution (Controller)       |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |        8. Interceptors (Post-request stream / map)    |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |             9. Exception Filters (nếu có lỗi)         |
               +---------------------------+---------------------------+
                                           |
                                           v
               +-------------------------------------------------------+
               |                  10. Outgoing Response                |
               +-------------------------------------------------------+
```

---

## 12. Hướng dẫn Cài đặt, Khởi chạy & Kiểm thử

### 12.1. Cấu trúc thư mục thực hành
```text
NestJS/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   └── custom.decorators.ts       # Custom @Roles() và @User() decorators
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts   # Custom Exception Filter chuẩn hóa lỗi JSON
│   │   ├── guards/
│   │   │   └── roles.guard.ts             # Roles Guard bảo vệ endpoint
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts     # Đo thời gian thực thi RxJS
│   │   │   └── transform.interceptor.ts   # Bọc phản hồi { success, data, ... }
│   │   ├── middleware/
│   │   │   └── logger.middleware.ts       # Middleware HTTP request logger
│   │   └── pipes/
│   │       └── parse-positive-int.pipe.ts # Custom Pipe kiểm tra số nguyên dương > 0
│   ├── items/
│   │   ├── dto/
│   │   │   ├── create-item.dto.ts
│   │   │   └── update-item.dto.ts
│   │   ├── items.controller.ts            # Minh họa Controller & Decorators
│   │   ├── items.controller.spec.ts       # Unit tests kiểm tra ItemsController
│   │   ├── items.service.ts               # Minh họa Provider & Business Logic
│   │   └── items.module.ts                # Minh họa Module & Middleware binding
│   ├── app.controller.ts
│   ├── app.controller.spec.ts
│   ├── app.module.ts                      # Root Module
│   ├── app.service.ts
│   └── main.ts                            # Bootstrap ứng dụng
├── .gitignore
├── nest-cli.json
├── package.json
├── README.md                              # Cẩm nang toàn diện 10 chuyên đề Overview
└── tsconfig.json
```

### 12.2. Khởi chạy ứng dụng
```bash
# 1. Cài đặt các thư viện cần thiết
npm install

# 2. Biên dịch mã nguồn TypeScript
npm run build

# 3. Khởi chạy server ở chế độ Development (Watch mode)
npm run start:dev
```
Server sẽ chạy tại: **`http://localhost:3000/api/v1`**

### 12.3. Chạy Unit Tests tự động
Dự án được viết sẵn 2 bộ test suite kiểm tra toàn diện AppController và ItemsController:
```bash
npm test
```
*Kết quả mẫu:*
```text
PASS src/app.controller.spec.ts
PASS src/items/items.controller.spec.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        7.165 s
Ran all test suites.
```

### 12.4. Kiểm thử các chuyên đề với cURL

#### 1. First steps & Controllers (Lấy danh sách):
```bash
curl -X GET http://localhost:3000/api/v1/items
```

#### 2. Pipes (Xác thực số nguyên dương):
```bash
# Hợp lệ (ID = 1):
curl -X GET http://localhost:3000/api/v1/items/1

# Kích hoạt Pipe báo lỗi (ID = -5):
curl -X GET http://localhost:3000/api/v1/items/-5
# Phản hồi từ Custom Exception Filter: {"success":false,"statusCode":400,"message":"Tham số 'id' phải là một số nguyên dương (> 0)..."}
```

#### 3. Guards & Custom Decorators (Bảo vệ endpoint):
```bash
# Thiếu Token -> Bị Guard chặn với mã 401 Unauthorized:
curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -d '{"title":"Khóa học NestJS","price":200}'

# Cung cấp đầy đủ Token và Role Admin -> Thành công 201 Created:
curl -X POST http://localhost:3000/api/v1/items \
  -H "Content-Type: application/json" \
  -H "x-auth-token: secret-token" \
  -H "x-user-role: admin" \
  -d '{"title":"Khóa học NestJS Pro","price":250}'
```

---
*Tài liệu và mã nguồn được xây dựng và duy trì bởi [Nhat2005p](https://github.com/Nhat2005p) - Thực tập sinh NodeJS tại Sun Asterisk.*
