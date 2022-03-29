import React, { useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { getSettings, getTenant } from '../selectors';
import FormError from '../components/FormError';
import Navbar from '../components/Navbar';
import { getCurrentUser } from '../selectors/entities/users';


const Preference = ({ currentUser, match, settings, history, location, tenant }: any) => {
    const [error, setError] = useState<string | null>(null);
    const [fullname, setFullname] = useState<string | "">(currentUser.name);
    const searchParams = new URLSearchParams(location.search);
    let spaceId = searchParams.get("X-Space-Id");
    const [user, setUser] = useState({ spaces: [], name: '' });
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        try {
            if (!fullname.trim()) {
                throw new Error("accounts.nameRequired");
            }

            // const r = await accountsRest.authFetch('user', {
            //     method: "PUT",
            //     body: JSON.stringify({
            //         fullname: fullname
            //     }),
            //     credentials: 'include'
            // });

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
<>
  <Navbar/>

    <main className="bg-cool-gray-100 h-screen">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-8 sm:px-0">



  <header>
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold leading-tight text-gray-900">
        账户设置
      </h1>
    </div>
  </header>

<div className="hidden sm:block">
  <div className="py-5">
    <div className="border-t border-gray-200"></div>
  </div>
</div>

<div className="mt-10 sm:mt-0">
  <div className="md:grid md:grid-cols-3 md:gap-6">
    <div className="md:col-span-1">
      <div className="px-4 sm:px-0">
        <h3 className="text-lg font-medium leading-6 text-gray-900">个人信息</h3>
        {/* <p className="mt-1 text-sm leading-5 text-gray-600">
          Use a permanent address where you can receive mail.
        </p> */}
      </div>
    </div>
    <div className="mt-5 md:mt-0 md:col-span-2">
      <form onSubmit={onSubmit}>
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium leading-5 text-gray-700">姓名</label>
                <input id="fullname"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"/>
              </div>
            </div>
          </div>
          {error && <FormError error={error!} />}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button className="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 focus:outline-none focus:shadow-outline-blue active:bg-indigo-600 transition duration-150 ease-in-out">
              保存
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>

        </div>
      </div>
    </main>

</>
    );
};

function mapStateToProps(state: any) {
    return {
      currentUser: getCurrentUser(state),
      settings: getSettings(state),
      tenant: getTenant(state)
    };
}

export default connect(mapStateToProps)(Preference);
