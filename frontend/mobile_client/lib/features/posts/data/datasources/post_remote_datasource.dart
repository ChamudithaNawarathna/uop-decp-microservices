import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/errors/app_exception.dart';
import '../models/post_model.dart';

abstract class PostRemoteDatasource {
  Future<List<PostModel>> getPosts();

  Future<PostModel> createPost({
    required int userId,
    required String username, // used in header
    required String fullName,
    required String content,
    List<String> mediaUrls,
  });

  Future<String> uploadMedia(String filePath);

  Future<void> likePost(String postId, int userId);

  Future<void> commentPost(String postId, CommentModel comment);
}

class PostRemoteDatasourceImpl implements PostRemoteDatasource {
  final Dio _dio;
  PostRemoteDatasourceImpl(this._dio);

  @override
  Future<List<PostModel>> getPosts() async {
    try {
      final resp = await _dio.get(ApiConstants.posts);
      final list = resp.data as List;
      return list
          .map((e) => PostModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  @override
  Future<PostModel> createPost({
    required int userId,
    required String username,
    required String fullName,
    required String content,
    List<String> mediaUrls = const [],
  }) async {
    try {
      final resp = await _dio.post(
        ApiConstants.posts,
        data: {
          'userId': userId,
          'fullName': fullName,
          'content': content,
          'mediaUrls': mediaUrls,
        },
        options: Options(headers: {'X-User-Name': username}),
      );
      return PostModel.fromJson(resp.data as Map<String, dynamic>);
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  @override
  Future<String> uploadMedia(String filePath) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath),
      });
      final resp = await _dio.post('${ApiConstants.posts}/media', data: formData);
      return resp.data['url'] as String;
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  @override
  Future<void> likePost(String postId, int userId) async {
    try {
      await _dio.post('${ApiConstants.posts}/$postId/like', data: {'userId': userId});
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  @override
  Future<void> commentPost(String postId, CommentModel comment) async {
    try {
      await _dio.post('${ApiConstants.posts}/$postId/comment', data: comment.toJson());
    } on DioException catch (e) {
      _handleError(e);
    }
  }

  Never _handleError(DioException e) {
    if (e.response?.statusCode == 401) throw const AuthException();
    if (e.response?.statusCode == 403) throw const ForbiddenException();
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.unknown) {
      throw const NetworkException();
    }
    throw ServerException(e.response?.data?['message']?.toString() ?? 'Error');
  }
}

final postDatasourceProvider = Provider<PostRemoteDatasource>((ref) {
  return PostRemoteDatasourceImpl(ref.watch(dioProvider));
});