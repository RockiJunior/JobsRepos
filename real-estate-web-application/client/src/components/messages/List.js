import React, { useState } from 'react';
import ListComponent from './ListComponent';
import MessageBox from './MessageBox';

const List = ({ userLogged, conversations, refreshList, setRefreshList }) => {
	const [currentChat, setCurrentChat] = useState();
	return (
		<>
			<div className="row">
				<div className="col-lg-5 col-xl-4">
					<div className="message_container">
						<div className="inbox_user_list px-0">
							<div className="iu_heading">
								<div className="candidate_revew_search_box mx-3">
									<form className="form-inline">
										<button className="btn" type="submit">
											<span className="flaticon-magnifiying-glass"></span>
										</button>
										<input
											className="form-control"
											type="search"
											placeholder="Buscar"
											aria-label="Search"
										/>
									</form>
								</div>
							</div>
							<ul>
								{conversations && conversations.length > 0 && conversations.map((chat, index) => (
									<ListComponent
										key={chat.id}
										chat={chat}
										currentChat={currentChat}
										setCurrentChat={setCurrentChat}
										refreshList={refreshList}
										setRefreshList={setRefreshList}
									/>
								))}
							</ul>
						</div>
					</div>
				</div>
				{conversations && currentChat && (
					<MessageBox
						currentChat={currentChat}
						userLogged={userLogged}
						conversations={conversations}
					/>
				)}
			</div>
		</>
	);
};

export default List;
