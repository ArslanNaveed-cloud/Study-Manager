package comsats.edu.atd.studymanager;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.snackbar.Snackbar;
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class ChangeProfileSummary extends AppCompatActivity {
    private ProgressDialog dialog;

    private TextInputEditText profilesummary,password;
    private Button save,cancel;
    private boolean IsError;
    String sumamry,password1,newname,pass,username;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_profile_summary);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        Intent intent = getIntent();
        sumamry= intent.getStringExtra("summary");
        password1  = intent.getStringExtra("password");
        SharedPreferences sharedPreferences = getSharedPreferences("userInfo", Context.MODE_PRIVATE);
        username = sharedPreferences.getString("username", "");
        password = findViewById(R.id.password);
        profilesummary = findViewById(R.id.profilesummary);
        profilesummary.setText(sumamry);
        save = findViewById(R.id.save);
        cancel = findViewById(R.id.cancel);
        save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkcontent();
            }
        });
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent1 = new Intent(ChangeProfileSummary.this,Setting.class);
                startActivity(intent1);
                finish();
            }
        });
    }


    public void checkcontent(){
        newname = profilesummary.getText().toString().trim();
        pass = password.getText().toString().trim();

        if(newname == null || newname.isEmpty()){
            IsError = true;
            profilesummary.setError("Field cannot be empty");
            profilesummary.setFocusable(true);
        }else if(newname.equals(sumamry)){
            IsError = true;
            profilesummary.setError("Please edit summary");
            profilesummary.setFocusable(true);
        }else if(profilesummary.length()<50){
            IsError = true;
            profilesummary.setError("Please give more summary");
            profilesummary.setFocusable(true);
        }

        else if(pass.isEmpty() || pass == null){
            IsError = true;
            password.setError("Field cannot be empty");
            password.setFocusable(true);

        }else if(!pass.equals(password1)){
            IsError = true;
            password.setError("Password doesnot match");
            password.setFocusable(true);

        }
        else{
            IsError = false;
        }
        if(!IsError){
            savechanges();

        }

    }
    private void savechanges() {
        dialog = ProgressDialog.show(ChangeProfileSummary.this, "Please Wait",
                "Loading Data...");
        dialog.show();

        final RequestQueue queue = Volley.newRequestQueue(ChangeProfileSummary.this);
        //this is the url where you want to send the request
        //TODO: replace with your own url to send request, as I am using my own localhost for this tutorial
        String url = Urls.UPDATE_SUMMMARY;
        Log.d("112233","Url Setting");
        // Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.POST, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        dialog.hide();
                        Log.d("112233","Url Setting");
                        try {
                            JSONObject reader = new JSONObject(response);
                            String status = reader.getString("status");

                            if (status.equals("500")) {
                                Snackbar.make(findViewById(android.R.id.content),"Profile Summary not updated", Snackbar.LENGTH_SHORT)
                                        .show();
                            }else if (status.equals("200")) {
                                Snackbar.make(findViewById(android.R.id.content),"Profile Summary Updated Successfully", Snackbar.LENGTH_LONG)
                                        .show();
                                waitforsometime();


                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                dialog.hide();
                Log.d("Collection Fragment", error.toString());
                error.printStackTrace();
                Snackbar.make(findViewById(android.R.id.content),"Opps.! Retry Again", Snackbar.LENGTH_SHORT)

                        .show();
            }
        }) {
            //adding parameters to the request
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                Map<String, String> params = new HashMap<>();
                params.put("username", username);
                params.put("summary", newname);

                return params;
            }
        };
        // Add the request to the RequestQueue.
        stringRequest.setRetryPolicy(new DefaultRetryPolicy(
                0,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        queue.add(stringRequest);
    }
    public void waitforsometime(){
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            public void run() {

                Intent intent = new Intent(ChangeProfileSummary.this,MyProfile.class);
                startActivity(intent);
                finish();

            }
        }, 1500);
    }
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()){

            case android.R.id.home:
                super.onBackPressed();
                break;
        }


        return true;
    }
}
