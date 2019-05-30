import { observable } from 'mobx';

export default class ObvStore {
	// user id
	@observable userId = '';
	// 콘텐츠 좋아요
	@observable userlikeContents = '';
	// 댓글 좋아요
	@observable userlikeComments = '';
	// 답글 좋아요
	@observable userlikereComments = '';
	// 이슈 추가 토글
	@observable layerToggle= false;
	// 댓글 추가 토글
	@observable layerCommentToggle = false;
	// 댓글 상태 토글
	@observable commentToggle = false;
	// 댓글 ID
	@observable commentID = '';
	// 답글 ID
	@observable recommentID ='';
	// 댓글 or 답글
	@observable commentKind ='';
	// 콘텐츠 선택
	@observable contentFilter = 'all';

	// 이슈 추가 - 이슈 카테고리
	@observable addCategory = 'others';

	// 이슈 필터
	@observable issueFilter = '';

	// 이슈 정렬
	@observable issueSort = 'date';

	// 조회수
	@observable hits = 0;

}
